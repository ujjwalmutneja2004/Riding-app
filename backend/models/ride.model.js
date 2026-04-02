const mongoose= require('mongoose');

const rideSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    captain:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'captain',
    },
    pickup:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },

    fare:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['pending','accepted','completed','cancelled'],
        default:'pending'
    },
    rideMode: {
        type: String,
        enum: ['Work Mode', 'Chill Mode', 'Urgent Mode'],
        default: 'Chill Mode'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    //in seconds
    duration:{
        type:Number,
    },
    //distance in meter
    distance:{
        type:Number,
    },
    paymentID:{
        type:String,
    },
    orderId:{
        type:String,
    },
    signature:{
        type:String,
    },
    otp:{
        type:String,
        select:false,
        required:true,
    },
    pickupLat: {
        type: Number,
        required: true
      },
      pickupLng: {
        type: Number,
        required: true
      },
      destLat: {
        type: Number,
        required: true
      },
      destLng: {
        type: Number,
        required: true
      },
     paymentMode: {
     type: String,
     enum: ["cash", "card"],
   },
   paymentStatus: {
  type: String,
  enum: ["pending", "paid"],
  },
  createdAtIST: {
    type: String
  }
      
}, { timestamps: true });

rideSchema.pre('save', function (next) {
    if (this.isNew) {
        const date = new Date();
        const options = { 
            timeZone: 'Asia/Kolkata', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        };
        this.createdAtIST = date.toLocaleString('en-IN', options);
    }
    next();
});

module.exports = mongoose.model('ride', rideSchema);
