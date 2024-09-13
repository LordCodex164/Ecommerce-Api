const User = require('../models/User');
const BadRequest = require('../errors/badRequest');
const unAuthenticated = require('../errors/unAuthenticated');
const {StatusCodes} = require('http-status-codes');

const register = async (req, res, next) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        throw new BadRequest('All fields are required');
    }
    try {
        const user = await User.create({...req.body});
        const token = user.createJwtToken();
        res.status(StatusCodes.CREATED).json({user, token});
        
    } catch (error) {
        next(error)
    }
};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        throw new BadRequest('All fields are required');
    }

    try {
       const user = await User.findOne({email}); 
       if(!user) {
           throw new unAuthenticated('No user with that email');
       }
       const isPasswordCorrect = await user.matchPasswords(password);
       if(!isPasswordCorrect) {
           throw new unAuthenticated('Incorrect password');
       }
       const token = user.createJwtToken();
        res.status(200).json({user, token});
    }

    catch (error){
       next(error)
    }
}

module.exports = {register, login}