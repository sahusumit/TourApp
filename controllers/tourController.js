const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};


exports.getAllTours = Factory.getAll(Tour);

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours
//     }
//   });
// });


exports.getTour = Factory.getOne(Tour, {path:'reviews'});

// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');
//   // .populate({
//   //   path:'guides',
//   //   select:'-__v -passwordChangedAt'
//   // });
//   // Tour.findOne({ _id: req.params.id })

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// });


exports.createTour = Factory.createOne(Tour);

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour
//     }
//   });
// });

exports.updateTour = Factory.updateOne(Tour);

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {

//     new: true,
//     runValidators: true
//   });

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour
//     }
//   });
// });


exports.deleteTour =  Factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});


// routes
//   .route('/tours-within/:distance/center/lating/unit/:unit', tourController.getToursWithin);
//   // tours-distance?distance=233&center=-40, 45&unit=mi
//   //tours-distance/233/center/34.111745,-118.113491/unit/mi

exports.getToursWithin = async (req, res, next) =>{
  const {distance, lating, unit } = req.params;
  const [lat, lng] = lating.split(',');

const radius = unit == 'mi' ? distance /3963.2 : distance /6378.1;
  if(!lat || !lng){
    next(new AppError(
      'Please provide the lattitude and longitude in the lat and lng.', 400
    ));
    }

    const tours = await Tour.find({
      startLocation:{ $geoWithin: {$centerSphere: [[lng, lat], radius]}}
    });
    
    console.log(tours, distance, lat, lng, unit, radius);
    res.status(200).json({
      status:'success',
      results:tours.length,
      data:{
        data:tours
      }
    });
}

exports.getDistances = async (req, res, next) => {
  const {lating, unit } = req.params;
  const [lat, lng] = lating.split(',');

  if(!lat || !lng){
    next(new AppError(
      'Please provide the lattitude and longitude in the lat and lng.', 400
    ));
    }

    const multiplire = unit == 'mi'? 0.00062137 : 0.001;
   const distances = await Tour.aggregate([{
     $geoNear:{
       near:{
         type:'Point',
         coordinates:[lng*1, lat*1]
       },
       distanceField: 'distance',
       distanceMultiplier: multiplire 
      }
     },{
        $project:{
            distance:1,
            name:1
        }
     
   }]);

   res.status(200).json({
    status:'success',
    data:{
      data:distances
    }
  });
}




















// //const fs = require('fs');
// const Tour = require('./../models/tourModel');

// //  const tours = JSON.parse(
// //     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// //     );


// // exports.checkID = (req, res, next, val)=>{
// //         console.log(`Tour id is ${val}`);
// //         if(req.params.id*1>tours.length){
// //             return res.status(400).json({
// //                 status: 'fails',
// //                 message:'Invalid id'
// //             });
// //         }
// //      next();
// //     }
 
// // exports.checkBody = (req, res, next)=>{
// //     if(!req.body.name || !req.body.price){
// //        return res.status(400).json({
// //            status:'fail',
// //            message:'Missing Name or Price'
// //        });
// //     }
// //     next();
// // };

// exports.getAllTours = async (req, res)=>{
//     try{
//         const tours = await Tour.find();
//         res.status(200).json({
//             status:'success',
//             result: tours.length,
//             data:{
//                 tours
//             }
//         });
//     } catch(err){
//         res.status(400).json({
//             status:"failure",
//             message:"Invalid id or data"
//         });
//     }
    
// } 

// exports.getTour = async (req, res)=>{
//     try{
//       const tour  = await Tour.findById(req.params.id);
//     // console.log(req.params);
//     // const id = req.params.id*1;
//     // const tour = tours.find(el=>el.id===id);
//         res.status(200).json({
//             status:'success',
//             data:{
//                 tour
//             }
//         });
//     }catch(err){
//         res.status(400).json({
//             status:"failure",
//             message:"Invalid id or data"
//         });
//     }  
// }

// exports.updateTour =  async (req, res)=>{
   
//     try{
//         const tour =  await Tour.findByIdAndUpdate(req.params.id, req.body,{
//         new:true,
//         runValidators:true
//     });
     
//     res.status(200).json({
//         status:'success',
//        // message:'update sucessfully',
//         data:{
//             tour
//         }
//     });
    
// } catch(err){
//     res.status(400).json({
//         status:'failure',
//         message:'unable to update data'
//     });
//    }
// }

// exports.deleteTour = async (req, res)=>{
//     try{
     
//         await Tour.findByIdAndDelete(req.params.id);
//         res.status(204).json({
//             status:'success',
//             data:null
//         });
//     }catch(err){
//         res.status(400).json({
//             status:'failure',
//             message:'unable to delete'
//         });
//     }   
// }

// exports.createTour = async (req, res)=>{

//    try{
//     const newTour =  await Tour.create(req.body);
      
//     res.status(201).json({
//             status:'sucess',
//             data:{
//                  tour:newTour
//                  }
//         });
     
//    }catch(err){
//        res.status(400).json({
//            status:'failure',
//            message: err
//        });    
//    }


//     // const newId = tours[tours.length-1].id+1;
//     //    const newTour = Object.assign({id:newId}, req.body);
//     //    tours.push(newTour);
    
//     //    fs.writeFile(
//     //        `${__dirname}/dev-data/data/tours-simple.json`,
//     //        JSON.stringify(tours),
//     //        err=>{
//     //            res
//     //            .status(201)
//     //            .json({
//     //                status:'sucess',
//     //                data:{
//     //                    tour:newTour
//     //                }
//     //            });
//     //         }
//     //    );
    

// }