const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = ['Server Error'];

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(error => error.message);
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = [`Blog not found with id: ${err.value}`];
    } else if (err.statusCode && err.message) {
        statusCode = err.statusCode;
        message = Array.isArray(err.message) ? err.message : [err.message];
    }

    res.status(statusCode).json({
        timestamp: Date.now(),
        status: statusCode,
        message
    });
};

module.exports = globalErrorHandler;
