const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Factory = require('./handlerFactory');


exports.getCheckoutSession = async (req, res, next)=>{
  //1) get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  //2) Create checkout-session
      const session = await stripe.checkout.sessions.create({
          payment_method_types:['card'],
          success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
          cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
          customer_email: req.user.email,
          client_reference_id: req.params.tourId,
          line_items:[{
              name: `${tour.name} Tour`,
              description: tour.summary,
              amount:tour.price * 100,
              currency: 'usd',
              quantity:1
          }
          ]
      });
  //3) create session response
    res.status(200).json({
        status:'success',
        session
    });

}

exports.createBookingCheckout =catchAsync( async (req, res, next)=>{
    const {tour, user, price} = req.query;
    if(!tour && !user && !price){
        return next();
    }
    await Booking.create({tour, user, price});
    res.redirect(req.originalUrl.split('?')[0]);
});



exports.createBooking  = Factory.createOne(Booking);
exports.getBooking  = Factory.getOne(Booking);
exports.getAllBooking  = Factory.getAll(Booking);
exports.updateBooking  = Factory.updateOne(Booking);
exports.deleteBooking  = Factory.deleteOne(Booking);
