// routes/auth.js
const express = require("express");
const router = express.Router();
const userController = require('../controllers/user.controller');
const userMiddleware = require('../middleware/users/user.middleware');
const {userEmailSent, emailOTPVerify, userLogin,userRegister} = require('../helpers/users/user.validator');
router.post("/login", userLogin, userController.login); // completed 0.1
router.post("/register", userRegister, userController.register); // completed 0.1
router.post("/emailOTPSent",userEmailSent, userController.emailOTPSent); // completed 0.1
router.post("/emailOTPVerify", emailOTPVerify, userController.emailOTPVerify); // completed 0.1
router.get("/logout", userMiddleware, userController.logout);
router.post("/mobileOTPSent", userController.mobileOTPSent); // under Precess 

module.exports = router;
