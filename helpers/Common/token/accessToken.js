const jwt = require('jsonwebtoken');
require("dotenv").config();
const accessToken = async(userData) => {
    const token = jwt.sign(userData, process.env.JWT_SECRET, {expiresIn:"2h"});
    return "Bearer " +token;
}
module.exports = accessToken;