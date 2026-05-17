const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const rideModel = require('../models/ride.model')
const { route } = require('../routes/maps.routes');
const { sendMessageToSocketId } = require('../socket')
const mapServices = require('../services/maps.service')
const { getCaptainEarningsService } = require('../services/ride.service');
const mongoose = require('mongoose');
const sendEmail = require("../email3");

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log("🔥 Create Ride API Hit");
    console.log("user in create ride", req.user._id)




    const { userId, pickup, destination, vehicleType, rideMode } = req.body;
    const destCoordinates = await mapServices.getAddressCoordinate(destination);
    const pickupcoordinates = await mapServices.getAddressCoordinate(pickup);

    console.log("pickup coordinates in create ride", pickupcoordinates)
    console.log("destination coordinates in create ride", destCoordinates)
    try {
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
            rideMode: rideMode || 'Chill Mode',
            paymentMode: "cash",
            paymentStatus: "pending",
            destLat: destCoordinates.lat,
            destLng: destCoordinates.lng,
            pickupLat: pickupcoordinates.lat,
            pickupLng: pickupcoordinates.lng,

        })
        console.log("i am creating ride", ride)



        // const distancebtwcaptainanduser=await mapServices.getDistanceTime(pickup);


        // console.log("pickup coordinates in create ride",pickupcoordinates)
        const captainsInRadius = await mapServices.getCaptainInTheRadius(pickupcoordinates.lng, pickupcoordinates.lat, 45, vehicleType);
        ride.otp = ""

        const ridewithUser = await rideModel.findOne({ _id: ride._id }).populate('user')
        //har captain in radius ko message bhejna
        captainsInRadius.map(captain => {
            console.log("captain in radius 12", captain.socketId);

            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: ridewithUser
            }
            )
        })
        console.log("captains in radius", captainsInRadius)
        res.status(201).json(ride)
    }
    catch (error) {
        console.log("🔥 ERROR in Create Ride Controller:", error);
        return res.status(500).json({ message: error.message })
    }

}


module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;
    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


module.exports.confirmRide = async (req, res) => {

    console.log("🔥 Confirm Ride API Hit");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log("checking controller")


    const { rideId } = req.body;
    console.log("➡️ Ride ID from body:", rideId);
    console.log("➡️ Captain from request:", req.captain);  // Very important

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        // User ko message kardo confirmed ho gyi ride
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        // Other captains ko batana ki ride accept ho gyi hai
        const captainsInRadius = await mapServices.getCaptainInTheRadius(ride.pickupLng, ride.pickupLat, 5, ride.vehicleType);
        
        captainsInRadius.forEach(cap => {
            if (cap._id.toString() !== req.captain._id.toString()) {
                sendMessageToSocketId(cap.socketId, {
                    event: 'ride-accepted-elsewhere',
                    data: { rideId: ride._id }
                });
            }
        });

        res.status(200).json(ride);
    } catch (error) {
        console.error("🔥 ERROR in Confirm Ride Controller:", error);
        return res.status(500).json({ message: error.message });
    }

}


module.exports.startRide = async (req, res) => {
    console.log("🔥 Start Ride API Hit");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, captain: req.captain, otp });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        const userEmail = ride.user.email; // Assuming the user's email is populated
        const emailSubject = "Your Ride Has Started!";
        const emailBody = `
      <h1>Your Ride Has Started!</h1>
      <p>Dear ${ride.user.fullname.firstname} ${ride.user.fullname.lastname},</p>
      <p>Your ride has started. Here are the details:</p>
      <ul>
        <li><strong>Pickup Location:</strong> ${ride.pickup}</li>
        <li><strong>Destination:</strong> ${ride.destination}</li>
        <li><strong>Vehicle Type:</strong> ${ride.captain.vehicleType}</li>
        <li><strong>Captain Name:</strong> ${ride.captain.fullname.firstname}</li>
      </ul>
      <p>We hope you have a great ride!</p>
      <p>Thank you for choosing TravelX.</p>
    `;

        sendEmail(userEmail, emailSubject, emailBody)
            .catch(err => console.error("Email failed:", err.message));

        return res.status(200).json(ride);

    } catch (error) {
        console.error("🔥 ERROR in Start Ride Controller:", error);
        return res.status(500).json({ message: error.message });
    }

}



module.exports.endRide = async (req, res) => {
    console.log("🔥 End Ride API Hit");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        const userEmail = ride.user.email; // Assuming the user's email is populated
        const emailSubject = "Your Ride Has Ended!";
        const emailBody = `
          <h1>Your Ride Has Ended!</h1>
          <p>Dear ${ride.user.fullname.firstname} ${ride.user.fullname.lastname} ,</p>
          <p>Thank you for riding with TravelX! Your ride has successfully ended. Here are the details of your trip:</p>
          <ul>
            <li><strong>Pickup Location:</strong> ${ride.pickup}</li>
            <li><strong>Destination:</strong> ${ride.destination}</li>
            <li><strong>Vehicle Type:</strong> ${ride.vehicleType}</li>
            <li><strong>Captain Name:</strong> ${ride.captain.fullname.firstname} ${ride.captain.fullname.lastname}</li>
            <li><strong>Total Fare:</strong> ₹${ride.fare}</li>
          </ul>
          <p>We hope you had a great experience. We look forward to serving you again soon!</p>
          <p>Best regards,<br/>The TravelX Team</p>
        `;

        sendEmail(userEmail, emailSubject, emailBody)
            .catch(err => console.error("Email failed:", err.message));

        return res.status(200).json(ride);

    } catch (error) {
        console.error("🔥 ERROR in End Ride Controller:", error);
        return res.status(500).json({ message: error.message });
    }

}


module.exports.rateRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating } = req.body;

    try {
        const ride = await rideModel.findOne({ _id: id, user: req.user._id });
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        if (ride.status !== 'completed') {
            return res.status(400).json({ message: 'Can only rate completed rides' });
        }
        if (ride.rating) {
            return res.status(400).json({ message: 'Ride already rated' });
        }

        ride.rating = rating;
        await ride.save();

        const captainModel = require('../models/captain.model');
        const captain = await captainModel.findById(ride.captain);

        if (captain) {
            captain.ratings.push({ user: req.user._id, score: rating });

            // Recalculate average
            const sum = captain.ratings.reduce((acc, curr) => acc + curr.score, 0);
            captain.averageRating = sum / captain.ratings.length;

            await captain.save();
        }

        return res.status(200).json({ message: 'Rating submitted successfully', ride });

    } catch (error) {
        console.error("🔥 ERROR in Rate Ride Controller:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports.getCaptainEarnings = async (req, res) => {
    const { captainId } = req.params;

    try {
        const earnings = await getCaptainEarningsService(captainId);
        res.json(earnings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};




// module.exports=router;
module.exports.cancelRideByCaptain = async (req, res) => {
    const { rideId } = req.body;
    try {
        const ride = await rideService.cancelRideByCaptain({ rideId, captain: req.captain });

        // Notify user about cancellation
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-cancelled-by-captain',
            data: ride
        });

        res.status(200).json({ message: 'Ride cancelled successfully', ride });
    } catch (error) {
        console.error("🔥 ERROR in Cancel Ride Controller:", error);
        res.status(500).json({ message: error.message });
    }
};
