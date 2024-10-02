const jwt = require('jsonwebtoken');
require("dotenv").config();
const refreshToken = async(userData) => {
        const token = jwt.sign(userData, process.env.JWT_SECRET, {expiresIn:"2m"});
        return token;
}
module.exports = refreshToken;