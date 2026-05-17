const mongoose = require('mongoose');
const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');
const CompanyWallet = require('../models/companyWallet.model');
const mapService = require('./maps.service');
const crypto = require('crypto');
const { sendMessageToSocketId } = require('../socket'); // ✅ Add this in ride.service.js
const { getDistanceTimeByCoord } = require('./maps.service'); // ✅ Import the function


async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required to calculate fare estimate.');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    if (!distanceTime) {
        throw new Error('Unable to calculate distance and time.');
    }

    const distance = parseFloat(distanceTime.distance);
    const duration = parseFloat(distanceTime.duration);

    console.log("Distance:", distance, "Duration:", duration);


    const baseFare = {
        auto: 30,
        car: 50,
        motorcycle: 20
    }

    const perKmRate = {
        auto: 10,
        car: 15,
        motorcycle: 8
    }

    const perMinuteRate = {
        auto: 2,
        car: 3,
        motorcycle: 1.5
    }

    const fare = {
        auto: Math.round(baseFare.auto + distance * perKmRate.auto + duration * perMinuteRate.auto),
        car: Math.round(baseFare.car + distance * perKmRate.car + duration * perMinuteRate.car),
        motorcycle: Math.round(baseFare.motorcycle + distance * perKmRate.motorcycle + duration * perMinuteRate.motorcycle)
    };

    console.log("Fare Estimate:", fare);

    // Call the external API to get the fare estimate
    // Replace this with your actual API call logic

    return fare; // Example fare estimate
}

module.exports.getFare = getFare;


function getOtp(num) {
    function generateOTP(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }

    return generateOTP(num);

}



module.exports.createRide = async ({
    user, pickup, destination, vehicleType, pickupLat,
    pickupLng,
    destLat,
    destLng,
    rideMode
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required to create a ride.');
    }

    const fare = await getFare(pickup, destination)
    const distanceData = await getDistanceTimeByCoord(
        { originLat: pickupLat, originLng: pickupLng },
        { destLat: destLat, destLng: destLng }
    );

    const routeSummary = distanceData.routes[0]?.summary;
    const distance = (routeSummary.lengthInMeters / 1000).toFixed(2); // in km
    const duration = (routeSummary.travelTimeInSeconds / 60).toFixed(2); // in minutes


    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType],
        pickupLat,
        pickupLng,
        destLat,
        destLng,
        distance,
        duration,
        rideMode

    });


    return ride;

}


module.exports.confirmRide = async ({ rideId, captain }) => {

    console.log("🛠️ confirmRide Service Called with:", rideId, captain);

    if (!rideId) {
        throw new Error('Ride ID is required to confirm a ride.');
    }

    //ride document me captain update kardo and status accepted kardo
    const updatedRide = await rideModel.findOneAndUpdate(
        { _id: rideId, status: 'pending' },
        {
            status: 'accepted',
            captain: captain._id
        },
        { new: true }
    );

    if (!updatedRide) {
        throw new Error('Ride already accepted or not found.');
    }
    // console.log("🔁 Populated Ride:", ride);

    // if (!ride.user || !ride.user.socketId) {
    //     console.error("❌ ride.user or ride.user.socketId is missing");
    // }

    //ride find ki apna document me jonsa accept honi ha
    const ride = await rideModel.findOne({ _id: rideId }).populate('user').populate('captain').select('+otp');
    if (!ride) {
        throw new Error('Ride not found.');
    }

    return ride;
}



module.exports.startRide = async ({ rideId, otp, captain }) => {
    console.log("🔥 Start Ride Service Called with:", rideId, otp, captain);

    if (!rideId || !otp) {
        throw new Error('Ride ID and OTP are required to start a ride.');
    }

    //ride document me captain update kardo and status accepted kardo
    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');
    if (!ride) {
        throw new Error('Ride not found.');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride is not accepted yet.');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP.');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    },
        {
            status: 'ongoing',
        })
    console.log("start ride socket sended")
    sendMessageToSocketId(ride.user.socketId, {
        event: 'ride-started',
        data: ride
    })

    return ride;
}



module.exports.endRide = async ({ rideId, captain }) => {
    console.log("🔥 End Ride Service Called with:", rideId, captain);

    if (!rideId) {
        throw new Error('Ride ID is required to end a ride.');
    }

    // Fetch ride with captain data
    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain');

    if (!ride) {
        throw new Error('Ride not found.');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride is not ongoing.');
    }

    // COMMISSION LOGIC
    const commissionRate = parseFloat(process.env.COMMISSION_RATE) || 0.20; // Default 20%
    const fare = ride.fare;
    const commission = fare * commissionRate;
    const captainShare = fare - commission;

    // WALLET UPDATES (Sequential for simplicity, ideally in a transaction)
    try {
        if (ride.paymentMode === 'card' || ride.paymentMode === 'online') {
            // Online Payment: Rider pays company. Company owes captain (fare - commission)
            await captainModel.findByIdAndUpdate(captain._id, {
                $inc: {
                    wallet: captainShare,
                    totalEarnings: captainShare
                }
            });
        } else {
            // Cash Payment: Rider pays captain. Captain keeps full amount.
            // Captain owes company the commission.
            await captainModel.findByIdAndUpdate(captain._id, {
                $inc: {
                    wallet: -commission,
                    totalEarnings: captainShare
                }
            });
        }

        // Update Company Wallet
        const companyWallet = await CompanyWallet.getWallet();
        await CompanyWallet.findByIdAndUpdate(companyWallet._id, {
            $inc: {
                totalBalance: commission,
                totalCommissionEarned: commission,
                totalRidesHandled: 1
            }
        });

        // Update Ride Status
        await rideModel.findOneAndUpdate({
            _id: rideId
        },
            {
                status: 'completed',
                paymentStatus: 'paid'
            });

    } catch (error) {
        console.error("❌ Error updating wallets during endRide:", error);
        throw new Error("Failed to process payments/wallets during ride completion.");
    }

    console.log("end ride socket sended")
    sendMessageToSocketId(ride.user.socketId, {
        event: 'ride-ended',
        data: ride
    })

    return ride;

}

module.exports.getCaptainEarningsService = async (captainId) => {
    // Calculate the beginning of today in ObjectId timestamp
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startObjectId = new mongoose.Types.ObjectId(
        Math.floor(startOfDay.getTime() / 1000).toString(16) + "0000000000000000"
    );

    const completedRides = await rideModel.aggregate([
        {
            $match: {
                captain: new mongoose.Types.ObjectId(captainId),
                status: 'completed',
                _id: { $gte: startObjectId }
            }
        },
        {
            $group: {
                _id: null,
                totalFare: { $sum: '$fare' },
                totaldistance: { $sum: '$distance' },
                totalduration: { $sum: '$duration' },
                totalRides: { $sum: 1 }
            }
        }
    ]);

    const rawFare = completedRides[0]?.totalFare || 0;
    const totalFare = Math.round(rawFare);

    return {
        totalFare,
        totaldistance: completedRides[0]?.totaldistance || 0,
        totalduration: completedRides[0]?.totalduration || 0,
        totalRides: completedRides[0]?.totalRides || 0
    };
};

module.exports.cancelRideByCaptain = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride ID is required to cancel a ride.');
    }

    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, captain: captain._id, status: 'accepted' },
        {
            status: 'cancelled'
        },
        { new: true }
    ).populate('user');

    if (!ride) {
        throw new Error('Ride not found or not currently accepted by you.');
    }

    return ride;
};
