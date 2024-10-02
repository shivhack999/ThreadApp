const Users = require('../models/user.model');
const {validationResult} = require('express-validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { response } = require('express');
const generateAccessToken = require('../helpers/Common/token/accessToken');
const generateRefreshToken = require('../helpers/Common/token/refreshToken');
const generateOTP = require('../helpers/common/generateOTP');
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
const image = async(req,res) =>{
    try {
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error.msg
        })
    }
}
const emailVerify = async(req,res) =>{
    try {
        const {email} = req.body;
        const OTP = generateOTP();
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
    emailVerify,
    mobileVerify,
    resetPassword,
    logout
}