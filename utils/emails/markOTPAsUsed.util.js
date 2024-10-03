const EmailOTP = require('../../models/EmailOTP.model');
const markOTPAsUsed = async(email) =>{
    await EmailOTP.updateOne({ email, used: false }, { $set: { used: true } });
}
module.exports = markOTPAsUsed;