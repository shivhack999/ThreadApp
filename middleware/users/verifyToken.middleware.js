const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ 
            success:false,
            response: "Access denied, token missing!" 
        });
    }
    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure your secret key is stored in environment variables
        req.user = decoded; // Attach the decoded user info to the request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = verifyToken;
