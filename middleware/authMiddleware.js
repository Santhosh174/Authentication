const jwt = require('jsonwebtoken')
const user = require('../models/users')

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'santhosh secret',(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/signin');
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.redirect('/signin');
    }
}


const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,'santhosh secret',async(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.User=null;
                next();
            }else{
                console.log(decodedToken);
                let User = await user.findById(decodedToken.id);
                res.locals.User=User;
                next();
            }
        })
    }
    else{
        res.locals.User=null;
        next();
    }
}
module.exports = { requireAuth, checkUser };