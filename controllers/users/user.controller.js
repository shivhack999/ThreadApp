require("dotenv").config();
const bcrypt = require("bcrypt");
const {validationResult} = require('express-validator');
const Users = require('../../models/users/user.model');
// const EmailOTP = require('../../models/users/EmailOTP.model');
const EmailOTP = require('../../models/users/EmailOTP.model');
const EmailSaveToDB = require('../../utils/emails/emailSaveOTPToDB.util');
const markOTPAsUsed = require('../../utils/emails/mark\OTPAsUsed.util');
const saveEmail = require('../../utils/emails/saveEmailToDB.util');
const getSavedOTPFromDB = require('../../utils/emails/getSavedOTPFromDB.util')
const generateAccessToken = require('../../helpers/Common/token/accessToken');
const generateRefreshToken = require('../../helpers/Common/token/refreshToken');
const generateOTP = require('../../helpers/common/generateOTP');
const sendMail = require('../../helpers/Common/mailer');
const sendMobileOTP = require('../../utils/mobiles/sentMobileOTP.util');
const saveMobileOTPToDB = require('../../utils/mobiles/saveMobileOTPToDB.util');
const Address = require('../../models/users/Address.model');
const userFindById = require("../../helpers/users/userFindById");
// const getSavedMobileOTPFromDB = require('../../utils/emails/getSavedOTPFromDB.util');

const emailOTPSent = async(req,res) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                success:false,
                errors:errors.array()
            })
        }
        const email = req.body.email;
        if(!email){
            return res.status(400).json({
                success:false,
                response:"Enter the valid email!"
            })
        }
        const Exist_Email = await Users.findOne({email:email, e_verify:true});
        if(Exist_Email){
            return res.status(400).json({
                success:false,
                response:'Email already register.'
            })
        }
        const OTP = await generateOTP();
        console.log(OTP);
        const subject = process.env.APP_NAME;
        const message = `Dear User, your OTP for completing the verification process is ${OTP}. Please use this code within the next 15 minutes to proceed. For your security, do not share this code with anyone. If you did not request this, please contact our support team immediately.`
        const mailResponse = sendMail(email, subject, message);
        if(mailResponse){
            const saveEmailResponse = await EmailSaveToDB(email,OTP);        
            if(!saveEmailResponse){
                return res.status(400).json({
                    success:false,
                    response:'Something is missing please try again!'
                })
            }
            return res.status(200).json({
                success:true,
                response:'Verification code send successfully'
            })
        }
        return res.status(200).json({
            success:false,
            response:'Something is missing please try again!'
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const emailOTPVerify = async(req,res) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                success:false,
                errors:errors.array()
            })
        }
        const {email, otp} = req.body;
        const savedOTP = await getSavedOTPFromDB(email);
        if(savedOTP == null){
            return res.status(400).json({
                success:false,
                response:"OTP has been expired !"
            })
        }
        let OTPstatus = false;
        if(savedOTP == otp){
            await markOTPAsUsed(email);
            // await saveEmail(id,email);
            OTPstatus = true;
        }
        OTPstatus && await EmailOTP.findOneAndUpdate({email}, {$set:{used:true}},{new:true});
        const statusValue = (OTPstatus) ? 200 : 400;
            return res.status(statusValue).json({
                success:OTPstatus,
                response: (OTPstatus)? "Email verified successfully." : "Enter the correct OTP"
            })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const login = async(req,res) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                success:false,
                errors:errors.array()
            })
        }
        const {email, password} = req.body;

        const userData = await Users.findOne({email}).exec();
        // console.log(userData)
        if(!userData){
            return res.status(400).json({
                success:false,
                response:"Email id not register?" 
            });
        }
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.status(400).json({ 
                success:false,
                response: 'Email id and password is Incorrect!'
            });
        }
        if(userData.active === false){
            return res.status(400).json({ 
                success:false,
                response: 'Your account is temporary blocked please connect with customer care.'
            });
        }
        const accessToken = await generateAccessToken({userData:userData});
        const refreshToken = await generateRefreshToken({userData:userData._id});
        await Users.findByIdAndUpdate(
            userData._id,
            {$set:{refreshToken:refreshToken}},
            {new:true}
        ) 
        const responseUserData = await Users.findById(userData._id).select("-password -create_At -refreshToken -__v");
        const option ={
            httpOnly:true,
            secure:false,
            sameSite:'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        }
        return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json({
            success:true,
            response:"User Login Successfully",
            userData:responseUserData,
            tokenType: 'Bearer',
            refreshToken:refreshToken
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            response:error.msg 
        })
    }
}
const register = async(req,res) =>{
    try {
        // console.log("Registration Data Received", req.body)
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                success:false,
                errors:errors.array()
            })
        }
        const {fullName, mobile, email, gender, password} = req.body;
        const emailVerify = await EmailOTP.findOne({email:email, used:true});
        if(!emailVerify){
            return res.status(400).json({
                success:false,
                response:"Verify email first!" 
            })
        }
        const existEmail = await Users.findOne({email});
        if(existEmail){
            return res.status(400).json({
                success:false,
                response:"Email are already register!" 
            })
        }
        const existMobile = await Users.findOne({mobile});
        if(existMobile){
            return res.status(400).json({
                success:false,
                response:"Mobile number are already register!" 
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({
            fullName, mobile, email, password:hashedPassword, gender, e_verify:true
        });
        const userData = await newUser.save();
        const accessToken = await generateAccessToken({userData:userData});
        const refreshToken = await generateRefreshToken({userData:userData._id});
        await Users.findByIdAndUpdate(
            userData._id,
            {$set:{refreshToken:refreshToken}},
            {new:true}
        ) 
        const responseUserData = await Users.findById(userData._id).select("-password -create_At -refreshToken -__v");
        const option ={
            httpOnly:true,
            secure:true,
            sameSite:'strict'
        }
        return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json({
            success:true,
            response:"User registered successfully",
            userData:responseUserData,
            tokenType: 'Bearer',
            refreshToken:refreshToken

        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}

const logout = async(req,res) =>{
    try {
        const userID = req.userID;
        const responseData = await Users.findByIdAndUpdate(
            userID,
            {$set:{refreshToken:null}},
            {new:true}
        )
        if(responseData){
            return res.status(200)
            .clearCookie('accessToken')
            .clearCookie('refreshToken')
            .json({
                success:true,
                response:"User logout successfully"
            })
        }
        return res.status(400).json({
            success:false,
            response:"Something is wrong please try again"
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error.msg
        })
    }
}
const mobileOTPSent = async(req,res) =>{
    try {
        const mobile = req.body.mobile;
        const Exist_Mobile = await Users.findOne({mobile:mobile , m_verify:true});
        if(Exist_Mobile){
            return res.status(400).json({
                success:false,
                response:'Mobile already register.'
            })
        }
        const OTP = await generateOTP();
        const message = `Your OTP verification code is : ${OTP} `;
        const OTPSentResponse = await sendMobileOTP(mobile,message); // write SMS code in below function 
        if(OTPSentResponse){
            await saveMobileOTPToDB(mobile, OTP);
            return res.status(200).json({
                success:true,
                response:'OTP sent successfully'
            });
        }
        return res.status(400).json({
            success:false,
            response:'something is missing Please try again !'
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error.msg
        })
    }
};
const mobileOTPVerify = async(req,res) =>{
    try {
        const {mobile, opt} = req.body;
        const savedOTP = await getSavedOTPFromDB(mobile);
        if(savedOTP == null){
            return res.status(400).json({
                success:false,
                response:'OPT has been expired'
            })

        }
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}


const image = async(req,res) =>{
    try {
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error.msg
        })
    }
}

const forgetPassword = async(req,res) =>{
    try {
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error.msg
        })
    }
}
const resetPassword = async(req,res) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                success:false,
                errors:errors.array()
            })
        }
        const userId = req.userID; // its work when we are use middleware
        // console.log(userId);
        const {oldPassword, newPassword} =  req.body;
        const userData = await Users.findById(userId).select("password");
        const passwordMatch = await bcrypt.compare(oldPassword, userData.password);
        if (!passwordMatch) {
            return res.status(400).json({ 
                success:false,
                response: 'Old Password is Incorrect!'
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const resetPasswordResponse = await Users.findByIdAndUpdate(userId, {$set:{ password:hashedPassword}},{new:true});
        let resetPasswordStatus = true;
        if(!resetPasswordResponse) resetPasswordStatus = false;
        const statusValue = (resetPasswordStatus)? 200 : 400;
        return res.status(statusValue).json({ 
            success:resetPasswordStatus,
            response: (resetPasswordStatus)? 'Password reset successful.' : 'Something is wrong please try again!'
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error.msg
        })
    }
}

const userProfile = async(req,res) =>{
    try {
        const userID = req.userID;
        const userData = await Users.findById(userID).select(" -active -create_At -refreshToken -password");
        return res.status(userData ? 200 : 400).json({
            success: userData? true : false,
            user: userData ? userData : 'No data found!'
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error.msg
        })
    }
}

const userProfileUpdate = async(req,res) =>{
    try {
        const userId = req.userID;
        const userData = await Users.findById(userId);
        if(!userData){
            return res.status(400).json({
                success:false,
                response:'Something is wrong please login first!'
            })
        }
        if(userData.active === false){
            return res.status(400).json({
                success:false,
                response:'Your account is temporary block please connect with customer care.'
            })
        }
        const updateField = req.body;

        const updatedUser = await Users.findByIdAndUpdate(userId,{ $set:{updateField}}, {new:true});
        return res.status(updatedUser ? 200 :400).json({
            success: updatedUser ? true : false,
            response:updatedUser ? 'Successfully profile Update.' : 'Something is missing please try again!'
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error.msg
        })
    }
}
const addressAdd = async(req,res) =>{
    try {
        const userId = req.userID;
        const addressData = {user:userId, ...req.body};
        const newAddress = new Address(addressData);
        console.log(newAddress);
        const address = await newAddress.save();
        return res.status(200).json({
            success:true,
            response:'Address added successfully',
            address
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const addressDelete = async(req,res) =>{
    try {
        const userId = req.userID;
        const addressId = req.query['addressId'] || req.body.addressId || req.params['addressId'];
        const address = await Address.findOneAndDelete({
            user:userId,
            _id:addressId
        })
        if(!address){
            return res.status(400).json({
                success:false,
                response:'Address not found'
            })
        }
        return res.status(200).json({
            success:true,
            response:'Address deleted successfully'
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const addressUpdate = async(req,res)=>{
    try {
        const userId = req.userID;
        const {
            addressId,
            full_name,
            phone_number,
            pin_code,
            state,
            city,
            house_No_Or_building_No,
            area
        } = req.body;
        const updatedAddress = await Address.findOneAndUpdate(
            {_id:addressId, user:userId},
            {
                full_name,
                phone_number,
                pin_code,
                state,
                city,
                house_No_Or_building_No,
                area
            },
            { new: true, runValidators: true } 
        );
        if (!updatedAddress) {
            return res.status(400).json({
                success:false,
                response:'Address not found'
            })
        }
        return res.status(200).json({
            success:true,
            response:'Address updated successfully',
            updatedAddress
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const addressShow = async(req,res) =>{
    try {
        const userId = req.userID;
        const address = await Address.find({user:userId}).select("-__v -create_At -user");
        return res.status(200).json({
            success:true,
            address
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:"something is wrong."
        })
    }
}

const verifyToken = async(req,res) =>{
    try {
        const userId = req.userID;
        let select = "refreshToken active"
        let userData = await userFindById(userId,select);
        if(userData.refreshToken == null){
            return res.status(400).json({
                success:false,
                response:"Login again."
            })
        }
        if(userData.active === false){
            return res.status(400).json({ 
                success:false,
                response: 'Your account is temporary blocked please connect with customer care.'
            });
        }
        select = "-password -create_At -refreshToken -__v";
        userData = await userFindById(userId, select);
        const accessToken = await generateAccessToken({userData:userData});
        const refreshToken = await generateRefreshToken({userData:userData._id});
        await Users.findByIdAndUpdate(
            userData._id,
            {$set:{refreshToken:refreshToken}},
            {new:true}
        )
        const option ={
            httpOnly:true,
            secure:true,
            sameSite:'strict'
        }
        return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json({
            success:true,
            response:"User Login Successfully",
            userData:userData,
            tokenType: 'Bearer',
            refreshToken:refreshToken
        })
        // delete userData._id
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            msg:"something is wrong."
        })
    }
}
const forgotPassword = async(req,res) =>{
    try {
        
    } catch (error) {
        return res.status(400).json({
            success:false,

        })
    }
}
module.exports={
    login,
    register,
    image,
    emailOTPSent,
    emailOTPVerify,
    resetPassword,
    logout,
    mobileOTPSent,
    mobileOTPVerify,
    userProfile,
    userProfileUpdate,
    addressAdd,
    addressDelete,
    addressUpdate,
    addressShow,
    verifyToken,
    forgotPassword
}