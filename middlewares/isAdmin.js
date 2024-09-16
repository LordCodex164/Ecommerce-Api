const jwt = require('jsonwebtoken');
const User = require('../models/User');
const unAuthenticated = require('../errors/unAuthenticated');
const {isTokenValid} = require('../utils/jwt');

const isAuth = async (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization || !authorization.startsWith('Bearer')) {
        throw new unAuthenticated('Not Authorized to access this route'); 
    }

    const token = authorization.split(' ')[1];

    try{
        const decoded = isTokenValid(token);
        const user= await User.findById(decoded.id);
        if(!user) {
            throw new unAuthenticated('User not found');
        }
        req.user = {id: user._id, email: user.email};
        next();
    }
    catch(error) {
        throw new unAuthenticated('Invalid credential');
    }
}

module.exports = isAuth;