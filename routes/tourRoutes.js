const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
//const reviewControlller = require('./../controllers/reviewController');
const reviewRouter = require('./reviewRoutes')

const routes = express.Router();

//routes.param('id', tourController.checkID);



//POST /tour/23443isdasd/reviews
//GET /tour/23443idsd/reviews
//POST /tour/23443isd/reviews/12432asdg
// routes
// .route('/:tourId/reviews')
// .post(authController.protect, 
//   authController.restrictTo('user','admin'),
//    reviewControlller.createReviews
//    );

routes.use('/:tourId/reviews', reviewRouter);


routes
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

routes.route('/tour-stats').get(tourController.getTourStats);
routes.route('/monthly-plan/:year').get(
  authController.protect, 
  authController.restrictTo('admin', 'lead-guide','guide'),
  tourController.getMonthlyPlan);


  routes
  .route('/tours-within/:distance/center/:lating/unit/:unit').get(tourController.getToursWithin);
  // tours-within?distance=233&center=-40, 45&unit=mi
  //tours-within/233/center/-40,45/unit/mi

  routes.route('/distances/:lating/unit/:unit').get(tourController.getDistances);

routes
.route('/')
.get(tourController.getAllTours)
.post(authController.protect, authController.restrictTo('admin', 'lead-guide'),  tourController.createTour);

routes
.route('/:id')
.get(tourController.getTour)
.patch(authController.protect, 
  authController.restrictTo('admin', 'lead-guide'), 
  // tourController.uploadTourImges, 
  // tourController.resizeTourImages, 
  tourController.updateTour)
.delete(authController.protect, authController.restrictTo('admin','lead-guide'),  tourController.deleteTour);



module.exports = routes;