const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.Auth;
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        req.userData = "decoded";
    };
    next();
};