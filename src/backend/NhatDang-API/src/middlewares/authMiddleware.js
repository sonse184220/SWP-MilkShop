const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkAuthenticated = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid access token' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = {
    checkAuthenticated
};
