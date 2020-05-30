const nodemailer = require('nodemailer');
const pug= require('pug');
const htmlToText =  require('html-to-text');

module.exports = class Email{
    constructor(user, url){
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `'sks-test <${process.env.EMAIL_FROM}>'`
    }
    newTransport() {
        if(process.env.NODE_ENV != 'production'){
            //Sendgrid
            return nodemailer.createTransport({
                service:'SendGrid',
                auth:{
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        } 
      return nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
                //Activate in gmail "less secure app" option'
        
            });
    }
    //send actula email
    async send(template, subjet){
        //1) Render the HTML based on a pug template
        const html =  pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subjet
        })
        //2) Define email option
        const emailOption = {
            from: this.from,
            to: this.to,
            subjet,
            html,
            text:htmlToText.fromString(html)
        };
        //3) Create a transport and send email   
        await this.newTransport().sendMail(emailOption);
    }
    async sendWelcome(){
       await  this.send('welcome', 'Welocome to the Natours Family!');
    }

    async sendPasswordReset(){
        await this.send('passwordReset', 'Your password Reset token (valid for onlu 10 minutes)');
    }
}

// const sendEmail = async options => {
   // 1) Create a transporter
    // const transporter = nodemailer.createTransport({
    // host:process.env.EMAIL_HOST,
    // port:process.env.EMAIL_PORT,
    //     auth: {
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    //     //Activate in gmail "less secure app" option'

    // });
   // 2) Define the email Option
//     const emailOption = {
//         from: 'sks-test<sks@gmail.com>',
//         to: options.email,
//         subjet:options.subjet,
//         text:options.message
//     }
//    // 3) Actually send the email
//      await transporter.sendMail(emailOption);
// }

// module.exports = sendEmail;