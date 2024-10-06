const mobileOTP =require('../../models/mobileOTP.model')
const saveMobileOTPToDB = async(mobile, otp)=>{
    try {
        const now = new Date();
        const saveOTP = await mobileOTP.findOneAndUpdate(
          {mobile},
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

module.exports = saveMobileOTPToDB;