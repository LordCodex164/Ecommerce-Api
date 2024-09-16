const jwt = require('jsonwebtoken');

const createJwtToken = (id, email) => {
   return jwt.sign({id, email}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
}

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

module.exports = {
    isTokenValid,
    createJwtToken
};