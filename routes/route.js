const express = require('express');
const route = express.Router();
const controller = require('../controller/controller')

route.get('/',controller.index);
route.get('/product',controller.product);
route.get('/details',controller.details);
route.get('/signin',controller.signin);
route.get('/signup',controller.signup);
route.post('/signin',controller.signin_post);
route.post('/signup',controller.signup_post);

module.exports = route;
