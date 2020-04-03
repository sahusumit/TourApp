const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Factory =require('./handlerFactory');

const filterObj = (obj,  ...allowedFields) =>{
    const newObj = {};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

exports.getMe = (req, res, next)=>{
    req.params.id = req.user.id;
    next();
};


exports.getAllUsers = Factory.getAll(User);

// exports.getAllUsers = catchAsync(async (req, res, next)=>{
//     const users  = await User.find();
//     res.status(200).json({
//         status:"Success",
//        results:users.length,
//        data:{
//            users
//        }
//     });
// });

exports.createUser =(req, res)=>{
res.status(500).json({
    status:"failed",
    message:'this routes is not defined! Please use /Signup instead'
});
}

exports.updateUserData = catchAsync(async (req, res, next)=>{
   // 1) Create error if uset POSTed pass data
   if(req.body.password || req.body.passwordConfirm){
       return next(new AppError('This route is not for password update. Please use UpdateMyPasswprd', 400));
   }
   // 2) Filetered out the objext that wanted to be updated
   const filteredBody = filterObj(req.body, 'name','email');

   // 3) Update the user documents
   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
       new:true,
       runValidators:true
   });
   res.status(200).json({
       status:'success',
       data:{
           user:updatedUser
       }
   });
});

exports.deleteMe = catchAsync(async (req, res, next)=> {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status:'success',
        data:null
    });
});

exports.getUser= Factory.getOne(User);

//Do not Update password with this!
exports.updateUser = Factory.updateOne(User);

exports.deleteUser = Factory.deleteOne(User);
