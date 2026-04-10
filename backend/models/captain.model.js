const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'last name must be at least 3 characters long'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']

    },
    password: {
        type: String,
        select: false,
        required: true,
    },
    googleId: { type: String, unique: true }, // ✅ Add this for Google OAuth
    socketId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'active', 'inactive'],
        default: 'pending',
    },
    isAvailable: {
        type: Boolean,
        default: false,
    },
    documents: {
        licenseFront: { type: String },
        licenseBack: { type: String },
        selfie: { type: String },
        numberPlate: { type: String },
        rc: { type: String }
    },
    rejectionReason: {
        type: String,
    },
    vehicle: {
        color: {
            type: String,
            required: true,
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'Plate must be at least 3 characters long'],
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1']
        },
        vehicleType:
        {
            type: String,
            enum: ['car', 'motorcycle', 'auto'],
            required: true,
        },

    },

    location: {
        lat: {
            type: Number,
        },

        lng: {
            type: Number,
        }

    },
    ratings: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            score: {
                type: Number,
                min: 1,
                max: 5
            }
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    wallet: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    }
}
    , { timestamps: true })

captainSchema.add({
    resetOtp: { type: String, select: false },
    resetOtpExpire: { type: Date }
});

///////////methods are used when you want to call on whole model  
captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
    return token;
}

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}


///////////methods are used when you want to call on particular document 
captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}




const captainModel = mongoose.model('captain', captainSchema)
module.exports = captainModel;
