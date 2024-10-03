const EmailOTP =require('../../models/EmailOTP.model')
const saveOTPToDB = async(email, otp)=>{
    try {
        const now = new Date();
        const saveOTP = await EmailOTP.findOneAndUpdate(
          {email},
          { $set : {otp},
            $setOnInsert : {createdAt : now}
          },
          {new: true, upsert: true, runValidators: true} //upsert:true ->create if not exists
        );
        // console.log(saveOTP);
        return (saveOTP) ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = saveOTPToDB;