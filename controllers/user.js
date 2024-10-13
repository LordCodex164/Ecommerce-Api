const {StatusCodes} = require('http-status-codes');
const User = require("../models/auth/auth");
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
    console.log("id", id);
    const {role, email} = req.body;
    if(!role && !email){
        return res.status(StatusCodes.BAD_REQUEST).json({message: "Please provide role or email"});
    }
    const user = await User.findById(id);
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({message: "User not found"});
    }
    await User.findByIdAndUpdate(id, {role, email}, {new: true, runValidators: true});
    console.log("user", user);
    checkUserPermissions(req.user, user?._id);
    res.status(StatusCodes.OK).json({user, message: "User updated successfully"});
}

module.exports = {
    getCurrentUser,
    updateUser
}