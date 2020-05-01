const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {

    // Get the token with headers

    const token = req.header('x-auth-token');
    // check a token exists
    if (!token) {
        return res.status(401).json({ msg: "No token, authentication failed" });
    }
    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "token invalid" })

    }


}