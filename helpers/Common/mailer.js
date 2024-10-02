const nodemailer = require('nodemailer');
const sendEmail = async(receiverEmail, message) =>{
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or use any other service (like Outlook, Yahoo, etc.)
            auth: {
                user: 'shivhack999@gmail.com', 
                pass: '#Anjali143$', 
            },
        });

        // Set up email data
    const mailOptions = {
        from: 'shivhack999@gmail.com',      // Sender address
        to: receiverEmail,                 // List of receivers
        subject: 'Your OTP Code',          // Subject line
        text: message,   
        html: `<p>${message}</p>`, // HTML body (optional)
    };

    } catch (error) {
        return false;
    }
}

module.exports = sendEmail;