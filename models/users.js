const mongoose = require('mongoose')
const { isEmail } = require('validator')

const user_schema = new mongoose.Schema({
    email : {
        type:String,
        required:[true,'Please enter an email'],
        unique:true,
        lowercase:true,
        validate: [isEmail,'Please enter a valid email']
    },
    password :{
        type:String,
        required:[true,'Please enter a password'],
        minLength:[6,'Minimum password length is 6 characters']
    }
})

const user = mongoose.model('auth_user',user_schema);
module.exports = user;