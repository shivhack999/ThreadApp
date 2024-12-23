const express = require("express");
const router = express.Router();
const {add, show} = require("../controllers/vendor/vendor.controller");
const tokenVerify = require("../middleware/emp/emp.middleware");
router.post("/add", tokenVerify, add);
router.get("/show", tokenVerify, show );
module.exports = router;
