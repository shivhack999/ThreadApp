const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '15m'  // OTP will expire after 15 minutes
    },
    used: {
        type: Boolean,
        default: false,
    },
});

// Create and export the OTP model
const EmailOTP = mongoose.model('EmailOTP', otpSchema);
module.exports = EmailOTP;
