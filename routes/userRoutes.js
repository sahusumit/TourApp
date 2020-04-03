const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');


const routes = express.Router();

routes.post('/signup', authController.signup);
routes.post('/login', authController.login);

routes.post('/forgotPassword', authController.forgotPassword);
routes.patch('/resetPassword/:token', authController.resetPassword);


// Protect all routes after this middleware! Therefor no need to protect each routes individually.
routes.use(authController.protect);

routes.patch('/updatePassword', authController.protect, authController.updatePassword);

routes.get('/me', userController.getMe, userController.getUser);
routes.patch('/updateData',  userController.updateUserData);
routes.delete('/deleteUser', userController.deleteMe);

routes.use(authController.restrictTo('admin'));   
routes
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);

routes
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = routes;