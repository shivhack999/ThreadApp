// routes/auth.js
const express = require("express");
const router = express.Router();
const userController = require('../controllers/user.controller');
const userMiddleware = require('../middleware/users/user.middleware');
const {userLogin,userRegister} = require('../helpers/users/user.validator');
router.post("/login", userLogin, userController.login); // completed 1.0
router.post("/register", userRegister, userController.register); // completed 1.0
router.post("/emailOTPSent", userMiddleware, userController.emailOTPSent); // completed 1.0
router.post("/emailOTPVerify", userMiddleware, userController.emailOTPVerify);

module.exports = router;
