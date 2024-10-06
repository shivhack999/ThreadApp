require("dotenv").config();
const bcrypt = require("bcrypt");
const Users = require('../models/user.model');
const EmailOTP = require('../models/EmailOTP.model');
const EmailSaveToDB = require('../utils/emails/emailSaveOTPToDB.util');
const markOTPAsUsed = require('../utils/emails/markOTPAsUsed.util');
const saveEmail = require('../utils/emails/saveEmailToDB.util');
const getSavedOTPFromDB = require('../utils/emails/getSavedOTPFromDB.util')
const {validationResult} = require('express-validator');
const generateAccessToken = require('../helpers/Common/token/accessToken');
const generateRefreshToken = require('../helpers/Common/token/refreshToken');
const generateOTP = require('../helpers/common/generateOTP');
const sendMail = require('../helpers/Common/mailer');
const login = async(req,res) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                success:false,
                errors:errors.array()
            })
        }
        const {mobile, password} = req.body;

        const userData = await Users.findOne({mobile:mobile}).exec();
        if(!userData){
            return res.status(400).json({
                success:false,
                response:"Mobile number not register?" 
            });
        }
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.status(400).json({ 
                success:false,
                response: 'Mobile No. and password is Incorrect!'
            });
        }
        const accessToken = await generateAccessToken({userData:userData});
        const refreshToken = await generateRefreshToken({userData:userData._id});
        await Users.findByIdAndUpdate(
            userData._id,
            {$set:{refreshToken:refreshToken}},
            {new:true}
        ) 
        const responseUserData = await Users.findById(userData._id).select("-password -create_At -refreshToken");
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
            userData:responseUserData,
            tokenType: 'Bearer',
            accessToken:accessToken,
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
        console.log(req.body)
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                success:false,
                errors:errors.array()
            })
        }
        const {name, mobile, gender, password} = req.body;
        const preUser = await Users.findOne({mobile});
        if(preUser){
            return res.status(400).json({
                success:false,
                response:"User already register !" 
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        const newUser = new Users({
            name, mobile, password:hashedPassword, gender
        });
        const userData = await newUser.save();
        const accessToken = await generateAccessToken({userData:userData});
        const refreshToken = await generateRefreshToken({userData:userData._id});
        await Users.findByIdAndUpdate(
            userData._id,
            {$set:{refreshToken:refreshToken}},
            {new:true}
        ) 
        const responseUserData = await Users.findById(userData._id).select("-password -create_At -refreshToken");
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
            accessToken:accessToken,
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
const emailOTPSent = async(req,res) =>{
    try {
        const email = req.body.email;
        console.log(email);
        const Exist_Email = await Users.findOne({email:email});
        if(Exist_Email){
            return res.status(400).json({
                success:false,
                response:'Email already register.'
            })
        }
        const OTP = await generateOTP();
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
        const id = req.userID;
        console.log(id);
        const {email, otp} = req.body;
        const savedOTP = await getSavedOTPFromDB(email);
        console.log(savedOTP);
        if(savedOTP == null){
            return res.status(400).json({
                success:false,
                response:"OTP has been expired !"
            })
        }
        let OTPstatus = false;
        if(savedOTP == otp){
            await markOTPAsUsed(email);
            await saveEmail(id,email);
            OTPstatus = true;
        }
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



const image = async(req,res) =>{
    try {
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error.msg
        })
    }
}
const mobileVerify = async(req,res) =>{
    try {
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error.msg
        })
    }
};
const logout = async(req,res) =>{
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
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error.msg
        })
    }
}


module.exports={
    login,
    register,
    image,
    emailOTPSent,
    emailOTPVerify,
    mobileVerify,
    resetPassword,
    logout
}