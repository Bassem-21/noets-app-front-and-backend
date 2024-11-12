const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
    try {
        // Ensure the 'authorization' header exists and starts with 'Bearer '
        const authorizationHeader = req.headers.authorization;
        
        // Extract the token from the header by removing 'Bearer ' prefix
        const token = authorizationHeader.replace("Bearer ", "");
        // console.log('Token received:', token);

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        // console.log('Decoded token:', decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = authMiddleware;
