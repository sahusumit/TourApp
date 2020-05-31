const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const routes = express.Router();


routes.use(viewsController.alerts);

routes.get('/', authController.isLoggedIn, viewsController.getOverview);
routes.get('/tour/:slug', authController.isLoggedIn,  viewsController.getTour);
routes.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
routes.get('/me', authController.protect,  viewsController.getAccount);
routes.post('/submit-form-data', authController.protect,  viewsController.updateUserData);
routes.get('/my-tours', authController.protect,  viewsController.getMyTours);

module.exports = routes;