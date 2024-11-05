const express = require('express')
const router = express.Router();
const userMiddleware = require('../middleware/users/user.middleware.js');
const activityController = require('../controllers/users/activity.controller.js')
router.post("/addToCart", userMiddleware , activityController.addToCart); // completed 0.1
router.get("/removeToCart", userMiddleware, activityController.removeToCart); // completed 0.1


module.exports = router;