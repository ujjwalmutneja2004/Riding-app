const captainModel = require('../models/captain.model');


module.exports.createCaptain = async ({
    firstname, lastname, email, password, color, plate, capacity, vehicleType, documents
}) => {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required')
    }


    console.log("captain service is called");
    console.log("🔥 STEP 8: INPUT DATA", {
        firstname, lastname, email, password, color, plate, capacity, vehicleType, documents
    });

    const captain = await captainModel.create({
        fullname: {
            firstname,
            lastname,
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        },
        documents: documents || {
            licenseFront: '',
            licenseBack: '',
            selfie: '',
            numberPlate: '',
            rc: ''
        }
    })

    console.log("🔥 STEP 10: CAPTAIN CREATED", captain);
    return captain;
}


const crypto = require('crypto');
const sendEmail = require('../email3');

async function requestPasswordReset(email) {
    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) return;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = crypto.createHash('sha256').update(otp).digest('hex');
    captain.resetOtp = hashed;
    captain.resetOtpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await captain.save();
    await sendEmail(email, 'Password Reset OTP', `<p>Your OTP is ${otp}. It will expire in 10 minutes.</p>`);
}

async function verifyOtp(email, otp) {
    const captain = await captainModel.findOne({ email }).select('+resetOtp +resetOtpExpire');
    if (!captain || !captain.resetOtp || !captain.resetOtpExpire) {
        throw new Error('Invalid credentials');
    }
    if (captain.resetOtpExpire < new Date()) {
        throw new Error('OTP expired');
    }
    const hashed = crypto.createHash('sha256').update(otp).digest('hex');
    if (hashed !== captain.resetOtp) {
        throw new Error('Invalid credentials');
    }
}

async function resetPassword(email, otp, newPassword) {
    await verifyOtp(email, otp);
    const captain = await captainModel.findOne({ email }).select('+resetOtp +resetOtpExpire +password');
    if (!captain) {
        throw new Error('Invalid credentials');
    }
    const hashedPassword = await captainModel.hashPassword(newPassword);
    captain.password = hashedPassword;
    captain.resetOtp = undefined;
    captain.resetOtpExpire = undefined;
    await captain.save();
}

module.exports.requestPasswordReset = requestPasswordReset;
module.exports.verifyOtp = verifyOtp;
module.exports.resetPassword = resetPassword;
