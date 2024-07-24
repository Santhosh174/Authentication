const express = require('express');
const route = express.Router();
const controller = require('../controller/controller')
const { requireAuth,checkUser } = require('../middleware/authMiddleware')
const { initiatePasswordReset, resetPassword } = require('../controller/controller');


route.get('*',checkUser);
route.get('/',controller.index);
route.get('/product',controller.product);
route.get('/details',requireAuth,controller.details);
route.get('/signin',controller.signin);
route.get('/signup',controller.signup);
route.post('/signin',controller.signin_post);
route.post('/signup',controller.signup_post);
route.get('/logout',controller.logout)
route.get('/profile',requireAuth,controller.profile)
route.get('/otp',controller.otpp)
route.post('/verifyotp',controller.verifyotp)
route.post('/resendotp',controller.resendotp)
route.get('/edit/:id',controller.edit)
route.post('/updatename',controller.updatename)
route.post('/forgot-password', controller.initiatePasswordReset);
route.get('/reset-password/:token', controller.rp);
route.post('/reset-password/:token', controller.resetPassword);
module.exports = route;
