require("dotenv").config();
const nodemailer = require('nodemailer');
const sendEmail = async(receiverEmail, subject, message) =>{
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or use any other service (like Outlook, Yahoo, etc.)
            source:true,
            host:'smtp.gmail.com',
            port:465,
            auth: {
                user: process.env.GMAIL, 
                pass: process.env.GMAIL_PASSWORD, 
            },
        });
        // Set up email data
        const mailOptions = {
            from: process.env.GMAIL,      // Sender address
            to: receiverEmail,           // List of receivers
            subject: subject,           // Subject line
            text: message,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;

    } catch (error) {
        console.error("error" + error)
        return false;
    }
}

module.exports = sendEmail;