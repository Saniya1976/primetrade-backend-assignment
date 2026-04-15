const { ZodError } = require('zod');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    let errors = null;

    // Log the error
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
        stack: err.stack,
        statusCode,
        body: req.body,
        user: req.user ? req.user.id : 'anonymous'
    });

    // Handle Zod Validation Errors
    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errors = err.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
        }));
    }

    res.status(statusCode).json({
        message,
        errors,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
