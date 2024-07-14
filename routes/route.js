const express = require('express');
const route = express.Router();
const controller = require('../controller/controller')

route.get('/',controller.index);
route.get('/product',controller.product);
route.get('/details',controller.details);

module.exports = route;
