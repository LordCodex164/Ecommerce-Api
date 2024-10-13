const jwt = require('jsonwebtoken');
const User = require('../models/auth/auth');
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
        const user= await User.findById(decoded.id).select("-password");
        if(!user) {
            throw new unAuthenticated('User not found');
        }

        if(!user.isVerified){
            throw new unAuthenticated('Please verify your email');
        }

        req.user = {id: user._id, email: user.email, role: user.role};
        next();
    }
    catch(error) {
        throw new unAuthenticated('Invalid credential');
    }
}

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            throw new unAuthenticated('Not Authorized to access this route');
        }
        next();
    }
}

module.exports = {
    isAuth,
    authorizePermissions
};