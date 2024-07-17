const user = require('../models/users')

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
    catch{
        console.log(err)
        res.status(400).send('Error,user not created')
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