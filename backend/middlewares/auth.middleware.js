
const userModel=require('../models/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklist.Token.model');
const captainmodel = require('../models/captain.model');

module.exports.authUser=async(req,res,next)=>{
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if(!token){
        return res.status(401).json({message:'Unauthenticated'})
    }

    const isBlacklisted=await blacklistTokenModel.findOne({token:token})
    if(isBlacklisted){
        return res.status(401).json({message:'Unauthorized'})
    }


    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        
        //decoded me vahi data ayega jo encrypt karna vkt ayega means id
        const user=await userModel.findById(decoded._id);
        req.user=user;
        return next();
    }
    catch(err){
        return res.status(401).json({message:'Unauthorized pakka'})
    }

}

module.exports.authCaptain = async (req, res, next) => {
    console.log('🔵 [authCaptain] Middleware hit for route:', req.originalUrl);

    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    console.log("🔵 [authCaptain] Extracted Token:", token);

    if (!token) {
        console.log("🔴 [authCaptain] No token provided - Unauthenticated");
        return res.status(401).json({ message: 'Unauthenticated' });
    }

    try {
        // Check if token is blacklisted
        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) {
            console.log("🔴 [authCaptain] Token is blacklisted:", token);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🟢 [authCaptain] Decoded Token:", decoded);

        // Fetch the captain document
        const captain = await captainmodel.findById(decoded._id);
        console.log("🟢 [authCaptain] Captain found:", captain);

        if (!captain) {
            console.log("🔴 [authCaptain] Captain not found with ID:", decoded._id);
            return res.status(401).json({ message: 'Unauthorized - Captain not found' });
        }

        req.captain = captain;
        next();  // Proceed to the controller

    } catch (err) {
        console.log("🔴 [authCaptain] JWT Verification Error:", err.message);
        return res.status(401).json({ message: 'Unauthorized - Invalid or expired token' });
    }
};

module.exports.isApproved = async (req, res, next) => {
    if (req.captain.status !== 'approved') {
        return res.status(403).json({ 
            message: 'Your account is not approved yet or has been rejected.', 
            status: req.captain.status,
            reason: req.captain.rejectionReason 
        });
    }
next();
};

module.exports.authAdmin = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ message: 'Unauthenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ensure the token belongs to an admin (we add role: 'admin' to the payload)
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden - Not an admin' });
        }

        const adminModel = require('../models/admin.model');
        const admin = await adminModel.findById(decoded._id);

        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized - Admin not found' });
        }

        req.admin = admin;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};
