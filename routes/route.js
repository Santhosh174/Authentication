const express = require('express');
const route = express.Router();
const controller = require('../controller/controller')

route.get('/',controller.index);
route.get('/product',controller.product);
route.get('/details',controller.details);
route.get('/signin',controller.signin);
route.get('/signup',controller.signup);

module.exports = route;
