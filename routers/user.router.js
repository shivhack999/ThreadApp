const express = require("express");
const router = express.Router();
const dynamicUpload =  require('../middleware/upload.middleware');
const userController = require('../controllers/users/user.controller');
const userMiddleware = require('../middleware/users/user.middleware');
const deviceIndentify = require('../middleware/security/identifyDevice');
const {userEmailSent, emailOTPVerify, userLogin, userRegister, userResetPassword} = require('../helpers/users/user.validator');
router.post("/register", userRegister, userController.register); // completed 0.1
router.post("/login", deviceIndentify, userLogin, userController.login); // completed 0.1
router.post("/emailOTPSent",userEmailSent, userController.emailOTPSent); // completed 0.1
router.post("/emailOTPVerify", emailOTPVerify, userController.emailOTPVerify); // completed 0.1
router.post("/resetPassword", userMiddleware, userResetPassword, userController.resetPassword); // completed 0.1
router.get("/logout", userMiddleware, userController.logout); // completed 0.1
router.get("/userProfile", userMiddleware, userController.userProfile); // completed 0.1
router.put("/userProfileUpdate", userMiddleware , userController.userProfileUpdate); // completed 0.1
router.post("/addressAdd", userMiddleware, userController.addressAdd); // completed 0.1
router.get("/addressDelete", userMiddleware, userController.addressDelete); // completed 0.1
router.put("/addressUpdate", userMiddleware, userController.addressUpdate); // completed 0.1
router.get("/addressShow", userMiddleware, userController.addressShow); // completed 0.1
router.get("/verifyToken", userMiddleware, userController.verifyToken);
router.post("/mobileOTPSent", userController.mobileOTPSent); // under Precess 
router.post("/forgotPassword", userController.forgotPassword);
router.post("userProfileImg", userMiddleware, dynamicUpload("/user/profile"), userController.userProfileImg)
module.exports = router;