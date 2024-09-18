const {StatusCodes} = require('http-status-codes');
const User = require("../models/Auth");
const checkUserPermissions = require('../utils/checkUserPermissions');

const getCurrentUser = async (req, res, next) => {
    try{
     res.status(StatusCodes.ACCEPTED).json({user: req.user})
    }
    catch(error){
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    const {id} = req.params;
    const {role, email} = req.body;
    if(!role && !email){
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Please provide role or email"});
    }
    const user = await User.findByIdAndUpdate(id, {role, email}, {new: true, runValidators: true});
    checkUserPermissions(req.user, user._id);
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({message: "User not found"});
    }
    res.status(StatusCodes.OK).json({user});
}

module.exports = {
    getCurrentUser,
    updateUser
}