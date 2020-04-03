const Review = require('./../models/reviewModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Factory =require('./handlerFactory');

// exports.getAllReviews = catchAsync(async (req, res, next)=>{
//     let filter = {};
//     if(req.params.tourId) filter = {tour:req.params.tourId};
//   const review = await Review.find(filter);

//   res.status(200).json({
//       status:'success',
//       data:{
//           review
//       }
//   });
// });

exports.getAllReviews = Factory.getAll(Review);

exports.setTourUserIds = (req, res, next)=>{
    //Allows nested route
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id; 
    next();
};

exports.createReviews = Factory.createOne(Review);

// exports.createReviews = catchAsync(async (req, res, next)=>{
//     //Allows nested route
//     // if(!req.body.tour) req.body.tour = req.params.tourId;
//     // if(!req.body.user) req.body.user = req.user.id; 

//     const newReview = await Review.create(req.body);
//     res.status(201).json({
//         status:'success',
//         data:{
//             review:newReview
//         }
//     });

// });

exports.getReview = Factory.getOne(Review);
exports.updateReview = Factory.updateOne(Review);
exports.deleteReview = Factory.deleteOne(Review);