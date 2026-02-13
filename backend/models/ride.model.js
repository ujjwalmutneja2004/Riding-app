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
      
})

module.exports= mongoose.model('ride',rideSchema);
