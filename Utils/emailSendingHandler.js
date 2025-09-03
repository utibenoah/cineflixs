const nodemailer = require('nodemailer');


let sendEmail= async(options)=>{
//create tranport
        const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        //port:process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
            }
        });


// create mail options
        const emailOptions={
            from: 'Cineflixs<supports@cineflix.com>',
            to: options.email,
            subject: options.subject,
            text: options.message
        }



// send mail
    await transporter.sendMail(emailOptions)


}

module.exports =sendEmail