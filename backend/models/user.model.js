const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const preHashedDefaultPassword = '$2b$10$Fh45XYZ';


const userSchema=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First name must be at least 3 characters long'],
        },
        lastname:{
            type:String,
            // minlength:[3,'last name must be at least 3 characters long'],
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:[5,'Email must be at least 5 charcters long']

    },
    password:{
        type:String,
        required:true,
        default: preHashedDefaultPassword
    },
    googleId: { type: String, default: null },
    socketId:{
        type:String,
    }


})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    if (!this.password) {
        // if password is missing, set default
        this.password = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    } else {
        // if password exists, hash it if not already hashed
        const passwordRegex = /^\$2[aby]\$.{56}$/; // bcrypt hash format
        if (!passwordRegex.test(this.password)) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
    next();
});


userSchema.methods.generateAuthToken=function(){
    //we added timetolive here as hamari blacklist tokenlist sirf 24 hours ke liya valid ha
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn: '24h'})
    return token;
}

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.statics.hashPassword=async function(password){
 return await bcrypt.hash(password,10);
}


const userModel=mongoose.model('user',userSchema);

module.exports=userModel;