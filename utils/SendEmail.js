const nodemailer = require('nodemailer');

const SendEmail = async (options) => {
    //create transporter (service send email like gmail)
    const transporter = nodemailer.createTransport({
        service: 'gmail', //if secure is false port=587, else port=465
        secure: true,
        auth: {
            //my email
            user: process.env.Email,
            pass: process.env.password,
        }, 
        tls: {
            rejectUnauthorized: false // 👈 هذا يسمح بقبول الشهادات الموقعة ذاتياً
          }
    });
    //define email options
    const mailOpts = {
        from: "ADE App <be2430423@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    //send email
    await transporter.sendMail(mailOpts);
}

module.exports = SendEmail;