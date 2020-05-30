const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.getOverview =  catchAsync( async(req, res) => {
  //1) get tour data from collection
   const tours = await Tour.find();
  //2) Build template
  //3) Render the template using tour data from 1
    res.status(200).render('overview',{
      title:'All tours',
      tours
    });
  });


 exports.getTour = catchAsync(async (req, res)=>{
   // 1) get the data , for the requested tour 
   const tour = await Tour.findOne({slug: req.params.slug}).populate({
     path:'reviews',
     fields:'review ratin user'
   });

  //  if(!tour){
  //    return next(new AppError('There is no tour with that name.', 404));
  //  }
   //2) build template
   //3) Render template using the tour data
    res.status(200).render('tour',{
      title:`${tour.name} Tour`,
     tour
    });
  });

  exports.getLoginForm = (req, res)=>{
    res.status(200).render('login',{
      title:'Log into your account'
    })
  };

  exports.getAccount = (req, res) => {
    res.status(200).render('account', {
      title:'Your account'
    });
  };


  exports.getMyTours = catchAsync(async (req, res, next)=>{
    //1) Find all the bookings
    console.log(req.user);
    const bookings = await Booking.find({user:req.user.id});
  
    //2) Find the tours with returned IDs
    const tourIDs = bookings.map(el => el.tour);
    const tours = await Tour.find({_id:{$in:tourIDs}});

    res.status(200).render('overview', {
      title:'My Tours',
      tours
    });
  });

  exports.updateUserData = catchAsync( async(req, res, next) => {
    console.log(req.body)
    const updatedUser = await User.findByIdAndUpdate(req.user.id,{
      name: req.body.name,
      email: req.body.email
    },{
      new: true,
      runValidators:true
    } );
    res.status(200).render('account', {
      title:'Your account',
      user: updatedUser
    });
  });
