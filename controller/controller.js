const user = require('../models/users')
const jwt = require('jsonwebtoken')

const handleErrors = (err) =>{
    console.log(err.message,err.code);
    let errors = {email :'',password:''};
    //duplicate email error
    if(err.code == 11000){
        errors.email = 'This email is already registered';
        return errors;
    }

    //validation error
    if(err.message.includes('auth_user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}


const index = (req,res) => {
    res.render('index',{title: "Home"});
}
const product = (req,res) => {
    res.render('product',{title: "Products"})
}
const details = (req,res) => {
    const product = req.query.product;
    res.render('details', { title: product ,product });
}
const signin = (req,res) => {
    res.render('signin')
}
const signup = (req,res) => {
    res.render('signup')
}
const signin_post = (req,res) => {
    const {email,password} = req.body;
    console.log(email,password)
    res.render('signin')
}
const signup_post = async(req,res) => {
    const {email,password} = req.body;
    try{
        const new_user = await user.create({email,password})
        res.status(201).json(new_user);
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
    res.render('signup')
}
module.exports = {
    index,
    product,
    details,
    signin,
    signup,
    signin_post,
    signup_post
}