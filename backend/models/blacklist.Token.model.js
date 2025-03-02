
const mongoose=require('mongoose');



const blacklistTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true,
    },

     //now aise hamari blacklist bharti jayegi db me so we will use time to live so tahta automaticllay blacklsit vala document delete
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:86400 //24 hours in
    }
})


module.exports=mongoose.model('BlacklistToken',blacklistTokenSchema);