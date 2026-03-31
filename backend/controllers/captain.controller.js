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

    // Extract Cloudinary URLs from req.files
    const documents = {
        licenseFront: req.files?.['licenseFront']?.[0]?.path || '',
        licenseBack: req.files?.['licenseBack']?.[0]?.path || '',
        selfie: req.files?.['selfie']?.[0]?.path || '',
        numberPlate: req.files?.['numberPlate']?.[0]?.path || '',
        rc: req.files?.['rc']?.[0]?.path || ''
    };

    // Check if all documents are uploaded (mandatory for fleet vetting)
    if (!documents.licenseFront || !documents.licenseBack || !documents.selfie || !documents.numberPlate || !documents.rc) {
        return res.status(400).json({ message: 'All verification documents are required' });
    }

    const captain = await captainService.createCaptain({
        firstname: fullname?.firstname || req.body.firstname,
        lastname: fullname?.lastname || req.body.lastname,
        email,
        password: hashedPassword,
        color: vehicle?.color || req.body.color,
        plate: vehicle?.plate || req.body.plate,
        capacity: vehicle?.capacity || req.body.capacity,
        vehicleType: vehicle?.vehicleType || req.body.vehicleType,
        documents
    })

    sendWelcomeEmail(email, fullname.firstname)
  .catch(err => {
    console.error("Welcome email failed:", err.message);
  });

    const token=captain.generateAuthToken();
     res.cookie('token', token, {
        // httpOnly: true,  // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === 'production',
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
        // httpOnly: true,  // Prevents client-side JS from accessing the cookie
        secure: false,    // Ensures the cookie is sent only over HTTPS (disable for localhost testing)
        sameSite: 'None', // Required for cross-site requests
        path: '/',
        domain: 'riding-app.onrender.com',
        });
        console.log('Setting cookie', token);
    res.status(200).json({token, captain: { ...captain.toObject(), status: captain.status }});
}



module.exports.getCaptainProfile = async (req, res, next) => {
    const captain = req.captain;
    if (!captain) {
        return res.status(404).json({ message: 'Captain not found' });
    }

    res.status(200).json({ captain });
}


// module.exports.logoutCaptain = async (req, res, next) => {  

//     try{
//          console.log("Logout route hit in captain currently in captain controoller");
//         res.clearCookie('token', {
//              httpOnly: true,
//              secure: true,            // ✅ Must be true on HTTPS (Render uses HTTPS)
//              sameSite: 'None' ,
//              // cache: 'no-store'   
//         });
//         res.set("Cache-Control", "no-store"); 
    
    
//         const token=req.cookies.token|| (req.headers.authorization && req.headers.authorization.split(' ')[1]);
//         if (!token) {
//             return res.status(400).json({ message: 'No token provided' });
//         }
//         await blackListTokenModel.create({token});
       
//         res.status(200).json({message:'Logout successfully'});

//     }
//     catch(err){
//         res.status(500).json({message:'Something went wrong'})
//     }  
// }
module.exports.logoutCaptain = async (req, res, next) => {  
    console.log("Inside logoutCaptain controller - Starting execution");

    try {
        console.log("Clearing cookie...");
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,  // ✅ Must be true on HTTPS (Render uses HTTPS)
            sameSite: 'None',
            path: '/',
            domain: '.riding-app.onrender.com',
        });

        console.log("Cookie cleared");

        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
        console.log("Token extracted:", token);

        if (!token) {
            console.log("No token provided");
            return res.status(400).json({ message: 'No token provided' });
        }

        await blackListTokenModel.create({ token });
        console.log("Token blacklisted successfully");

        res.status(200).json({ message: 'Logout successfully' });

    } catch (err) {
        console.log("Error in logout route:", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        await captainService.requestPasswordReset(email);
        res.status(200).json({ message: 'If the email exists, an OTP has been sent' });
    } catch (err) {
        res.status(200).json({ message: 'If the email exists, an OTP has been sent' });
    }
};

module.exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        await captainService.verifyOtp(email, otp);
        res.status(200).json({ ok: true });
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired OTP' });
    }
};

module.exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        await captainService.resetPassword(email, otp, newPassword);
        res.status(200).json({ ok: true });
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired OTP' });
    }
};


module.exports.getCaptainHistory = async (req, res, next) => {
    try {
        const rideModel = require('../models/ride.model');
        const rides = await rideModel.find({ captain: req.captain._id, status: { $in: ['completed', 'cancelled'] } })
            .populate('user')
            .sort({ _id: -1 });
        res.status(200).json(rides);
    } catch (err) {
        console.error("Error fetching captain history:", err);
        res.status(500).json({ message: 'Failed to fetch ride history' });
    }
};

module.exports.getCaptainAnalytics = async (req, res, next) => {
    try {
        const rideModel = require('../models/ride.model');
        const captainId = req.captain._id;

        // Fetch all completed rides to compute stats in memory (more compatible across mongo versions than complex pipelines for a small scale app)
        const rides = await rideModel.find({ captain: captainId, status: 'completed' });
        
        let totalEarnings = 0;
        let totalRides = rides.length;
        
        // Compute last 7 days earnings
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const thisYearStart = new Date(today.getFullYear(), 0, 1);
        
        let last7DaysEarnings = 0;
        let thisMonthEarnings = 0;
        let thisYearEarnings = 0;

        rides.forEach(ride => {
            const fare = ride.fare || 0;
            totalEarnings += fare;
            
            // For simplicity, we use the internal MongoDB timestamp (_id) if no createdAt is defined
            const rideDate = ride._id.getTimestamp();
            
            if (rideDate >= sevenDaysAgo) last7DaysEarnings += fare;
            if (rideDate >= thisMonthStart) thisMonthEarnings += fare;
            if (rideDate >= thisYearStart) thisYearEarnings += fare;
        });

        res.status(200).json({
            lifetimeEarnings: totalEarnings,
            totalRides: totalRides,
            averageRating: req.captain.averageRating || 0,
            chartData: [
                { name: 'Last 7 Days', earnings: last7DaysEarnings },
                { name: 'This Month', earnings: thisMonthEarnings },
                { name: 'This Year', earnings: thisYearEarnings }
            ]
        });
    } catch (err) {
        console.error("Error fetching captain analytics:", err);
        res.status(500).json({ message: 'Failed to fetch analytics' });
    }
};



