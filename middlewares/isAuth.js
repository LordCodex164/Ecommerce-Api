const jwt = require('jsonwebtoken');
const User = require('../models/User');
const unAuthenticated = require('../errors/unAuthenticated');

const isAuth = async (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization || !authorization.startsWith('Bearer')) {
        throw new unAuthenticated('Not Authorized to access this route'); 
    }

    const token = authorization.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const user= await User.findById(decoded.id);
        req.user = {id: user._id, email: user.email};
        next();
    }
    catch{
        throw new unAuthenticated('Invalid credentials');
    }
}

module.exports = isAuth;