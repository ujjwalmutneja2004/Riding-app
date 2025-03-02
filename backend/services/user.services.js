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