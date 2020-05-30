const path = require('path');
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const viewRoutes = require('./routes/viewRoutes');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'views'));


//create middleware

//1) Global middleware
// Security HTTP
app.use(helmet());

//console.log(process.env.NODE_ENV); // to print the envrionment
if(process.env.NODE_ENV=== 'development'){
app.use(morgan('dev'));
}

//Limit request from same IP
const limiter = rateLimit({
  max:100,
  windowMs: 60*60*1000,
  message: 'Too Many request from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body Parser, Reading data from the body  into req.body
app.use(express.json({limit:'10kb'})); 
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(cookieParser());

// data sanitization against NoSQL  query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
whitelist:['duration', 'ratingQuantity','ratingAverage', 'maxGroupSize', 'difficulty','price']
}));

// to show the static file directly to root in URL
//app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//Test middleware
app.use((req, res, next)=>{
    // console.log(req.cookies);
    next();
});

app.use((req, res, next)=>{
 req.requestTime = new Date().toISOString();
 next();
});


// app.get('/',(req, res )=>{
//    res
//    .status(200)
//    .json({message:"hello from the server!", app:"Naturus"});
// });

// app.post('/', (req, res)=>{
//     res
//     .status(200)
//     .json({message:"this is hello from the server via post request", 
//     app:'Natorus'});
// });




// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);
// app.post('/api/v1/tours',createTour);

// app.get('/', (req, res)=>{
//   res.status(200).render('base',{
//     tour:'The Forest Hiker',
//     user: 'Sumit'
//   });
// });

// app.get('/overview', (req, res)=>{
//   res.status(200).render('overview',{
//     title:'All tours'
//   });
// });

// app.get('/tour', (req, res)=>{
//   res.status(200).render('tour',{
//     title:'The Forest Hiker Tour'
//   });
// });


//routes fro view for frontend
app.use('/', viewRoutes);

//3) Routes
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/bookings', bookingRoutes);




app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
  app.use(globalErrorHandler);
  


//4) START SERVER
module.exports = app;