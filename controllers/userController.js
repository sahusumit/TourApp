const multer = require('multer');
const sharp  = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Factory =require('./handlerFactory');


// const multerStorage  = multer.diskStorage({
//     destination:(req, file, cb)=>{
//         cb(null,'public/img/users' );
//     },
//     filename:(req, file, cb)=>{
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// })

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    } else{
        cb(new AppError('Not an image ! please upload image only.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhotos = upload.single('photo');

exports.resizeUserPhoto =catchAsync( async (req, res, next) =>{
    if(!req.file){
      return next();
    }
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

   await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/users/${req.file.filename}`);
    next(); 
})


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

   // console.log("this is file" +req.file);
   // console.log("body"+body.file);
   // 1) Create error if uset POSTed pass data
   if(req.body.password || req.body.passwordConfirm){
       return next(new AppError('This route is not for password update. Please use UpdateMyPasswprd', 400));
   }
   // 2) Filetered out the objext that wanted to be updated
   const filteredBody = filterObj(req.body, 'name','email');
   if(req.file) filteredBody.photo = req.file.filename;

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
