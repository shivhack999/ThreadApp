const express = require("express");
const router = express.Router();
const userController = require('../controllers/users/user.controller');
const userMiddleware = require('../middleware/users/user.middleware');
const {userEmailSent, emailOTPVerify, userLogin, userRegister, userResetPassword} = require('../helpers/users/user.validator');
router.post("/register", userRegister, userController.register); // completed 0.1
router.post("/login", userLogin, userController.login); // completed 0.1
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

module.exports = router;