require('dotenv').config();
var unirest = require("unirest");
const fast2sms = require("fast-two-sms");
const sendSMS = async(mobile, message) =>{
    // const options = {
    //     authorization :process.env.FAST2SMS_SECRET,
    //     message: message,
    //     numbers: [mobile],
    //   };
    // try {
    //     fast2sms
    //     .sendMessage(options)
    //     .then((response) => {
    //         console.log("response",response)
    //         console.log("otp sent successfully");
    //     })
    //     return true;
    // } catch (error) {
    //     console.log("nkjdnfkj", error)
    //     return false;
    // }


        var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

        req.headers({
        "authorization": process.env.FAST2SMS_SECRET
        });

        req.form({
        "variables_values": "5599",
        "route": "otp",
        "numbers": mobile,
        });

        req.end(function (res) {
        if (res.error)
            console.log(req.error)
            console.log(res.body);
        });
}
module.exports = sendSMS;