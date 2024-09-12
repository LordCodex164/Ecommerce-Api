const User = require('../models/User');
const BadRequest = require('../errors/badRequest');
const unAuthenticated = require('../errors/unAuthenticated');
const {StatusCodes} = require('http-status-codes');

const register = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        throw new BadRequest('All fields are required');
    }

    try {
        const user = await User.create({name, email, password});
        const token = user.createJwtToken();
        await user.save();
        res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 3000,
            sameSite: "None",
            secure: true,
          });
        res.status(StatusCodes.CREATED).json({user, token});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        throw new BadRequest('All fields are required');
    }

    try {
       const user = await User.findOne({email}); 
       if(!user) {
           throw new unAuthenticated('Invalid credentials');
       }
       const isPasswordCorrect = await user.matchPasswords(password);
       if(!isPasswordCorrect) {
           throw new unAuthenticated('Invalid credentials');
       }
       const token = user.createJwtToken();
        res.status(200).json({user, token});
    }
    catch{

    }
}

module.exports = {register, login};