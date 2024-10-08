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
const sendMobileOTP = require('../utils/mobiles/sentMobileOTP.util');
const saveMobileOTPToDB = require('../utils/mobiles/saveMobileOTPToDB.util');
const getSavedMobileOTPFromDB = require('../utils/mobiles/getSavedOTPFromDB.util');

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
        console.log(userData)
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
        console.log("Registration Data Received", req.body)
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                success:false,
                errors:errors.array()
            })
        }
        const {fullName, mobile, email, gender, password} = req.body;
        const preUser = await Users.findOne({
            $or:[
                {email:email},
                {mobile:mobile}
            ]
        });
        // console.log(preUser)
        if(preUser){
            return res.status(400).json({
                success:false,
                response:"User already register !" 
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword)
        const newUser = new Users({
            fullName, mobile, password:hashedPassword, gender, e_verify:true
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
        console.log(email)
        if(!email){
            return res.status(400).json({
                success:false,
                response:"Enter the valid email!"
            })
        }
        const Exist_Email = await Users.findOne({email:email, e_verify:true});
        if(Exist_Email && Exist_Email.e_verify == true){
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

const logout = async(req,res) =>{
    try {
        
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
    mobileOTPSent,
    mobileOTPVerify,
    resetPassword,
    logout
}