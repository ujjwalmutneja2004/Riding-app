const captainModel = require('../models/captain.model');
//services are for creation of user/captain
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blackListTokenModel=require('../models/blacklist.Token.model')
const sendWelcomeEmail = require('../email');


///const { validationResult } = require('express-validator'); is used to extract validation results from a request when you're using express-validator in an Express.js app.

module.exports.registerCaptain = async (req, res, next) => {
    console.log("register captain");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { fullname, email, password, vehicle } = req.body;
    const isCaptainAlready = await captainModel.findOne({ email });

    if (isCaptainAlready) {
        return res.status(400).json({ message: 'Captain already exist' });
    }

    const hashedPassword = await captainModel.hashPassword(password);
    //now call captainservice
    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    })

     await sendWelcomeEmail(email, fullname.firstname);

    const token=captain.generateAuthToken();
     res.cookie('token', token, {
        httpOnly: true,  // Prevents client-side JS from accessing the cookie
        secure: true,    // Ensures the cookie is sent only over HTTPS (disable for localhost testing)
        sameSite: 'None', // Required for cross-site requests
        });
    res.status(201).json({token,captain});
}



module.exports.loginCaptain = async (req, res, next) => {
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const { email,password }=req.body;

    const captain=await captainModel.findOne({email}).select("+password");

    if(!captain){
        return res.status(400).json({message:'Invalid email or password'})
    }

    const isMatch=await captain.comparePassword(password);
    if(!isMatch){
        return res.status(400).json({message:'Invalid email or password'})
    }

    const token=captain.generateAuthToken();
    res.cookie('token', token, {
        httpOnly: true,  // Prevents client-side JS from accessing the cookie
        secure: true,    // Ensures the cookie is sent only over HTTPS (disable for localhost testing)
        sameSite: 'None', // Required for cross-site requests
        });
    res.status(200).json({token,captain});
}



module.exports.getCaptainProfile = async (req, res, next) => {
    const captain = req.captain;
    if (!captain) {
        return res.status(404).json({ message: 'Captain not found' });
    }

    res.status(200).json({ captain });
}


module.exports.logoutCaptain = async (req, res, next) => {  
    const token=req.cookies.token|| (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }
    await blackListTokenModel.create({token});
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,            // ✅ Must be true on HTTPS (Render uses HTTPS)
         sameSite: 'None'    
    });
    res.set("Cache-Control", "no-store");  // ✅ Cache disable
    res.status(200).json({message:'Logout successfully'});
}


