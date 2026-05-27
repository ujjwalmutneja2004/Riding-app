const mongoose=require('mongoose')

function connectToDb(){
    mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser:true,useUnifiedTopology:true}).then(async ()=>{
        console.log("connected to Db");
        try {
            const captainModel = require('../models/captain.model');
            const userModel = require('../models/user.model');
            await captainModel.updateMany({}, { $unset: { socketId: "" }, $set: { isAvailable: false } });
            await userModel.updateMany({}, { $unset: { socketId: "" } });
            console.log("🧹 Cleared stale socket connections from database.");
        } catch (err) {
            console.error("Error clearing stale socket states on startup:", err);
        }
    }).catch(err=>console.log(err));

}

module.exports=connectToDb;