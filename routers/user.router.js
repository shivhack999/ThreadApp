// routes/auth.js
const express = require("express");
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post("/login", userController.login); // completed 1.0
router.post("/register", userController.register); // completed 1.0
router.get("/logout", userController.logout);
router.get("/emailVerify", userController.emailVerify);

module.exports = router;
