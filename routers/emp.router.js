// routes/auth.js
const express = require("express");
const router = express.Router();
const empController = require('../controllers/emp/emp.controller');
const empMiddleware = require('../middleware/emp/emp.middleware');
const {} = require('../helpers/emp/emp.validator');
router.post("/login", empController.login);

module.exports = router;
