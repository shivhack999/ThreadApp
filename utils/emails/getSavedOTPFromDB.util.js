const EmailOTP = require('../../models/users/EmailOTP.model');

const getOTP = async(email) =>{
    const otpRecord = await EmailOTP.findOne({ email, used: false });
    return otpRecord ? otpRecord.otp : null;  // Return the OTP or null if not found
}
module.exports = getOTP;