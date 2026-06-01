
import createHttpError from "http-errors";

import logger from "../../lib/logger/logger.js";

const loggerHandler = (status, message, err, req, type = 'warn') => {
    logger.type({
        event: 'request_error',
        errorName: err?.name,
        message,
        status,
        method: req.method,
        path: req.originalUrl,
        stack: err.stack
    });
};

export const errorHandler = (err, req, res, next) => {

    if (err.name === 'ValidationError') {
        const status = 400;
        const message = err.errors;

        loggerHandler(status, message, err, req);

        res.status(status).json(message);
        return;
    }

    if (err.status) {
        const status = err.status;
        const message = err.message;

        loggerHandler(status, message, err, req);

        res.status(status).json({ message });
        return;
    }

    if (err.name === 'CastError') {
        const status = 404;
        const message = 'Resource not found';

        loggerHandler(status, message, err, req);

        res.status(status).json({ message });
        return;
    }

    if (err.message?.includes('E11000')) {
        const status = 409;
        const message = 'Resource duplicate';

        loggerHandler(status, message, err, req);

        res.status(status).json({ message });
        return;
    }

    const status = 500;
    const message = 'Error internal server';

    loggerHandler(status, message, err, req, 'error');

    res.status(status).json({ message });
};

export const routerNotFound = (req, res) => {
    loggerHandler(404, 'Route Not Found', err, req);

    throw new createHttpError(404, 'Route Not Found');
};