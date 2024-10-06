const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    mobile: {
        type: Number,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1m'  // OTP will expire after 15 minutes
    },
    used: {
        type: Boolean,
        default: false,
    },
});

// Create and export the OTP model
const Otp = mongoose.model('mobileOTP', otpSchema);
module.exports = Otp;
