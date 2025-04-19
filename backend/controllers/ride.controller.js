const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const rideModel = require('../models/ride.model');
const { route } = require('../routes/maps.routes');
const {sendMessageToSocketId}=require('../socket')
const mapServices=require('../services/maps.service')

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log("🔥 Create Ride API Hit");
    console.log("user in create ride",req.user._id)




    const { userId, pickup, destination, vehicleType } = req.body;
    const destCoordinates = await mapServices.getAddressCoordinate(destination);
    const pickupcoordinates=await mapServices.getAddressCoordinate(pickup);

    console.log("pickup coordinates in create ride",pickupcoordinates)
    console.log("destination coordinates in create ride",destCoordinates)
    try{
        const ride=await rideService.createRide({
            user:req.user._id,
            pickup,
            destination,
            vehicleType,
            destLat: destCoordinates.lat,
            destLng: destCoordinates.lng,
            pickupLat: pickupcoordinates.lat,
            pickupLng: pickupcoordinates.lng,

        })
         console.log("i am creating ride",ride)

     
        
        // const distancebtwcaptainanduser=await mapServices.getDistanceTime(pickup);

       
      // console.log("pickup coordinates in create ride",pickupcoordinates)
       const captainsInRadius=await mapServices.getCaptainInTheRadius(pickupcoordinates.lng,pickupcoordinates.lat,120);
       ride.otp=""

      const ridewithUser=await rideModel.findOne({_id:ride._id}).populate('user')
       //har captain in radius ko message bhejna
      captainsInRadius.map(captain => {
         console.log("captain in radius 12",captain.socketId);

        sendMessageToSocketId(captain.socketId, {
            event:'new-ride',
            data:ridewithUser
        }
        )
       })
       console.log("captains in radius",captainsInRadius)
       res.status(201).json(ride)
    }
    catch(error){
        console.log("🔥 ERROR in Create Ride Controller:", error);
        return res.status(500).json({message:error.message})
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


module.exports.confirmRide=async(req,res)=>{

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
        const ride = await rideService.confirmRide({rideId,captain:req.captain});
         

        //user ko message kardo cobnfirmed ho gyi ride
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        res.status(200).json(ride);
    } catch (error) {
        console.error("🔥 ERROR in Confirm Ride Controller:", error);
        return res.status(500).json({ message: error.message });
    }

}


module.exports.startRide=async(req,res)=>{
    console.log("🔥 Start Ride API Hit");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({rideId,captain:req.captain,otp});

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        res.status(200).json(ride);
    } catch (error) {
        console.error("🔥 ERROR in Start Ride Controller:", error);
        return res.status(500).json({ message: error.message });
    }

}



module.exports.endRide=async(req,res)=>{
    console.log("🔥 End Ride API Hit");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({rideId,captain:req.captain});

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        res.status(200).json(ride);
    } catch (error) {
        console.error("🔥 ERROR in End Ride Controller:", error);
        return res.status(500).json({ message: error.message });
    }

}





// module.exports=router;