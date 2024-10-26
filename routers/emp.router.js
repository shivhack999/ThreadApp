// routes/auth.js
const express = require("express");
const router = express.Router();
const empController = require('../controllers/emp/emp.controller');
const {employeeRegister} = require("../helpers/emp/emp.validator");
const {userLogin} = require('../helpers/users/user.validator');
const empMiddleware = require('../middleware/emp/emp.middleware');
const {} = require('../helpers/emp/emp.validator');
router.post("/addDepartment", empController.addDepartment); // completed 0.1
router.get("/showDepartment", empController.showDepartment); // completed 0.1

router.post("/login", userLogin, empController.login); // completed 0.1
router.post("/register", employeeRegister, empController.register); // completed 0.1

router.post("/addRole", empController.addRole); // completed 0.1
router.get("/showRole", empController.showRole); // completed 0.1
router.put("/updateRole", empController.updateRole);
router.get("/deleteRole", empController.deleteRole);
module.exports = router;
