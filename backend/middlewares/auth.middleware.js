
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
        
        return res.status(401).json({message:'Unauthorized'})

        //decoded me vahi data ayega jo encrypt karna vkt ayega means id
        const user=await userModel.findById(decoded._id);
        req.user=user;
        return next();
    }
    catch(err){
        return res.status(401).json({message:'Unauthorized pakka'})
    }

}


module.exports.authCaptain=async(req,res,next)=>{
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if(!token){
        return res.status(401).json({message:'Unauthenticated'})
    }

    const isBlacklisted=await blacklistTokenModel.findOne({token})
    if(isBlacklisted){
        return res.status(401).json({message:'Unauthorized'})
    }


    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); 
        //decoded me vahi data ayega jo encrypt karna vkt ayega means id
        const captain=await captainmodel.findById(decoded._id);
        console.log("cap",captain)
        req.captain=captain;
        return next();
    }
    catch(err){
        consolelog(err)
        return res.status(401).json({message:'Unauthorized pakka'})
    }

}