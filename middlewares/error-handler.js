const customError = require('../errors/custom-error');

const errorMiddleware = (err, req, res, next) => {
    if(err instanceof customError) {
        return res.status(err.statusCode).json({error: err.message});
    }
    res.status(500).json({error: err.message});
}

module.exports = errorMiddleware;