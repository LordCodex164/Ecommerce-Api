const {StatusCodes} = require('http-status-codes');

const getCurrentUser = async (req, res, next) => {
    try{
     res.status(StatusCodes.ACCEPTED).json({user: req.user})
    }
    catch(error){
        next(error)
    }
}

module.exports = {
    getCurrentUser
}