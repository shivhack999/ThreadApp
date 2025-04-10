require("dotenv").config();
const jwt = require('jsonwebtoken');


const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.cookies.accessToken;
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ 
            success:false,
            response: 'Access token is missing!'
        });
    }
    try {
        const SECRET_KEY = process.env.JWT_SECRET;
        const decodedData = jwt.verify(token, SECRET_KEY);
        req.userID = decodedData.userData._id || decodedData.userData;
        next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            msg:'Invalid token!',
        })
    }
};
module.exports = verifyToken;
