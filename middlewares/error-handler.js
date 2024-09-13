
const errorMiddleware = (err, req, res, next) => {
     console.log("errpath", err.path);
    const customErrorObj = {
        statusCode: err.statusCode || 500,
        message: err.message || 'Something went wrong',
    }
    if(err.name === "CastError") {
        customErrorObj.message = `Resource not found. Invalid: ${err.path}`;
        customErrorObj.statusCode = 404;
    }
    if(err.code === 11000) {
        customErrorObj.message = 'Duplicate value entered';
        customErrorObj.statusCode = 400;
    }
    if(err.name === "ValidationError") {
        const errorName = Object.values(err.errors).map((error) => error.message).join(",")
        customErrorObj.message = errorName;
        customErrorObj.statusCode = 400
    }
    return res.status(customErrorObj.statusCode).json(customErrorObj);
}

module.exports = errorMiddleware;