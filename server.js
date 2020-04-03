const mongoose  = require('mongoose');

const dotenv = require('dotenv');


process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });


dotenv.config( {path: './config.env'});

const app = require('./app');

//It show thw Envirment set by the express by default
console.log(app.get('env'));

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>
    console.log('DB connection sucessfull'));

    //TEST MODULE SECHEMA

    // const tourSchema = new mongoose.Schema({
    //     name:{
    //         type: String,
    //         required:[true, "must have a name"],
    //         unique:true
    //     },

    //     rating:{
    //         type: Number,
    //         default:4.5
    //     },

    //     price:{
    //         type:Number,
    //         require:[true, "must have price"]
    //     }

    // });

    // const Tour = mongoose.model('Tour', tourSchema);

    // const testTour = new Tour({
    //     name:' test tour hike',
    //     rating:4.9,
    //     price:800
    // });
    
    // testTour.save().then(doc=>{
    //     console.log(doc);
    // }).catch(err=>{
    //     console.log('ERROR', err)
    // });
//this show the environment variable to precess by core module 
//console.log(process.env);

const port =  process.env.PORT || 4001;
app.listen(port, () =>{
    console.log(`App running on the port ${port}`);
});


process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });