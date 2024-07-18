const user = require('../models/users')
const jwt = require('jsonwebtoken')

const handleErrors = (err) =>{
    console.log(err.message,err.code);
    let errors = {email :'',password:''};

    //incorrect email
    if(err.message == 'Incorrect Email'){
        errors.email = 'That email is not registered'
    }
    if(err.message == 'Incorrect Password'){
        errors.email = 'That Password in incorrect';
    }

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

const maxAge = 3 * 24 * 60 * 60;
 const createToken = (id) =>{
    return jwt.sign({id},'santhosh secret',{
        expiresIn : maxAge
    })
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
const signin_post = async(req,res) => {
    const {email,password} = req.body;
    try{
        const new_user = await user.login(email,password);
        const token = createToken(new_user._id)
        res.cookie('jwt',token,{ httpOnly: true , maxAge : maxAge *1000})
        res.status(200).json({new_user:new_user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
}
const signup_post = async(req,res) => {
    const {email,name,password} = req.body;
    try{
        const new_user = await user.create({email,name,password})
        const token = createToken(new_user._id)
        res.cookie('jwt',token,{ httpOnly: true , maxAge : maxAge *1000})
        res.status(201).json({new_user:new_user._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
    res.render('signup')
}

const logout = (req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}

module.exports = {
    index,
    product,
    details,
    signin,
    signup,
    signin_post,
    signup_post,
    logout
}