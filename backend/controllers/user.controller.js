//logic of main function

const userModel=require('../models/user.model');
const userService=require("../services/user.services");
const { validationResult }=require('express-validator')
const blackListTokenModel=require('../models/blacklist.Token.model')




module.exports.registerUser=async(req,res,next)=>{
    //jab bhi kuch error ata vo store in request
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }


    const { fullname,email,password }=req.body;
    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword=await userModel.hashPassword(password);
    //now call userservice
    const user=await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword
    })


    const token=user.generateAuthToken();
    res.cookie('token', token, {
        httpOnly: true,  // Prevents client-side JS from accessing the cookie
        secure: false,    // Ensures the cookie is sent only over HTTPS (disable for localhost testing)
        sameSite: 'Lax', // Required for cross-site requests
      });

    res.status(201).json({token,user})

}




module.exports.loginUser=async(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }


    const { email,password }=req.body;
    //in schema by default password ko false kar diya tha so we have to do password++ to take itt out now 
    const user=await userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({message:'Invalid Credentials'})
    }

    //already comparepassword is function made
    const isMatch=await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message:'Invalid email or password*'})
    }


    const token=user.generateAuthToken();
    res.cookie('token', token, {
        httpOnly: true,  // Prevents client-side JS from accessing the cookie
        secure: false,    // Ensures the cookie is sent only over HTTPS (disable for localhost testing)
        sameSite: 'Lax', // Required for cross-site requests
        });
    //token bhej denga user ko
    res.status(200) .json({token,user})

}


module.exports.getUserProfile=async(req,res,next)=>{
     res.status(200).json(req.user)
}


///since jonsa token ha usma user id ha so we want that token to be blacklist after user logout so thatn no one cabn access it and if someone saved it somehwre
//we will putn it in blacklist so no one can access
module.exports.logoutUser=async(req,res,next)=>{
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,  // ✅ Localhost pe false rakh
            sameSite: "Lax",
             
        });
        res.set("Cache-Control", "no-store");  // ✅ Cache disable
       
    
       ///req.cookies holds the cookies sent by the client.
     // ?. (optional chaining) ensures that if req.cookies is undefined (meaning cookies are not set up or used), it won’t throw an error.
    // If req.cookies.token exists, it is assigned to token.


    /*
    ?. ensures that if authorization is undefined or null, it doesn’t throw an error.
     .split(' ')[1] splits the string at the space (' ') and takes the second part, which is the actual token (YOUR_TOKEN_HERE).
     ?? null (Nullish Coalescing Operator):
      If split(' ')[1] is undefined or null, it defaults to null instead of undefined.
    */

     

    const token=req.cookies?.token || (req.headers.authorization.split(' ')[1]??null);
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }
    await blackListTokenModel.create({token})
    res.status(200).json({message:'Logged out successfully'})
}
catch(err){
    res.status(500).json({message:'Something went wrong'})
}
}