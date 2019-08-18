const jwt = require('jsonwebtoken');
const config = require('../../config/env.json');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, config.env.jwt_Token);
        next();
    } catch (error) {
        res.status(401).json({
            message: "Auth failed please login"
        })
    }
}