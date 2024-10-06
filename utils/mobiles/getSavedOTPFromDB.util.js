const MobileOTP = require('../../models/mobileOTP.model');

const getOTP = async(mobile) =>{
    const otpRecord = await MobileOTP.findOne({ mobile, used: false });
    return otpRecord ? otpRecord.otp : null;  // Return the OTP or null if not found
}
module.exports = getOTP;