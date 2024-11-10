const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
    try {
        const token = req.headers.Authorization?.replace("Bearer ", "");
        console.log('Token received:', token);

        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        console.log('Decoded token:', decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports =authMiddleware;

