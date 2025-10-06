const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    // Get the VIP Pass (token) from the request header
    const token = req.header('x-auth-token');

    // Check if there is no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // If there is a token, verify it
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // If it's a valid token, add the user's info to the request object
        req.user = decoded.user;
        next(); // Let the user proceed
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
