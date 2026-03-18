const userModel=require('../models/user.model');
//service which will interact with database


module.exports.createUser=async({
    firstname,lastname,email,password   //object ki form me accept
})=>{
    if(!firstname || !email || !password)
    {
        throw new Error('All fields are required')
    }

    const user=userModel.create({
        fullname:{
            firstname,
            lastname,
        },
        email,
        password,
    })

    return user;
}

const crypto = require('crypto');
const sendEmail = require('../email3');

async function requestPasswordReset(email) {
    const user = await userModel.findOne({ email });
    if (!user) return;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = crypto.createHash('sha256').update(otp).digest('hex');
    user.resetOtp = hashed;
    user.resetOtpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendEmail(email, 'Password Reset OTP', `<p>Your OTP is ${otp}. It will expire in 10 minutes.</p>`);
}

async function verifyOtp(email, otp) {
    const user = await userModel.findOne({ email }).select('+resetOtp +resetOtpExpire');
    if (!user || !user.resetOtp || !user.resetOtpExpire) {
        throw new Error('Invalid credentials');
    }
    if (user.resetOtpExpire < new Date()) {
        throw new Error('OTP expired');
    }
    const hashed = crypto.createHash('sha256').update(otp).digest('hex');
    if (hashed !== user.resetOtp) {
        throw new Error('Invalid credentials');
    }
}

async function resetPassword(email, otp, newPassword) {
    await verifyOtp(email, otp);
    const user = await userModel.findOne({ email }).select('+resetOtp +resetOtpExpire +password');
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const hashedPassword = await userModel.hashPassword(newPassword);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();
}

module.exports.requestPasswordReset = requestPasswordReset;
module.exports.verifyOtp = verifyOtp;
module.exports.resetPassword = resetPassword;
