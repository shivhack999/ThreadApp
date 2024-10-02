// routes/auth.js
const express = require("express");
const router = express.Router();
const userController = require('../controllers/user.controller');
const {userLogin,userRegister} = require('../helpers/users/user.validator');
router.post("/login", userLogin, userController.login); // completed 1.0
router.post("/register", userRegister, userController.register); // completed 1.0
router.get("/logout", userController.logout);
router.get("/emailVerify", userController.emailVerify);

module.exports = router;
