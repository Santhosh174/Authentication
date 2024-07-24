const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const user_schema = new mongoose.Schema({
    email : {
        type:String,
        required:[true,'Please enter an email'],
        unique:true,
        lowercase:true,
        validate: [isEmail,'Please enter a valid email']
    },
    name :{
        type:String,
        required:[true,'Please enter a username'],
        minLength:[3,'Minimum password length is 6 characters']
    },
    password :{
        type:String,
        required:[true,'Please enter a password'],
        minLength:[6,'Minimum password length is 6 characters']
    },
    resetToken: String,
    resetTokenExpiry: Date
})

user_schema.post('save',function(doc,next){
    
    next();
})

user_schema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt)
    next();
})


user_schema.statics.login = async function(email,password) {
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password)
        if(auth){
            return user;
        }
        throw Error('Incorrect Password')
    }
    throw Error('Incorrect Email')
}

const user = mongoose.model('auth_user',user_schema);
module.exports = user;