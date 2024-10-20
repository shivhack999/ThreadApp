const EmailOTP = require('../../models//users/EmailOTP.model');
const markOTPAsUsed = async(email) =>{
    await EmailOTP.updateOne({ email, used: false }, { $set: { used: true } });
}
module.exports = markOTPAsUsed;