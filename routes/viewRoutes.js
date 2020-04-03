const express = require('express');
const viewsController = require('./../controllers/viewsController');
const routes = express.Router();


  
routes.get('/overview', viewsController.getOverview);
routes.get('/tour',viewsController.getTour);

module.exports = routes;