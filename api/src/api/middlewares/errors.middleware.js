
import createHttpError from "http-errors";

import logger from "../../lib/logger/logger.js";

export const errorHandler = (err, req, res, next) => {

    if (err.name === 'ValidationError') {
        const message = err.errors;

        res.locals.logData = {
            event: 'request_error',
            error: 'ValidationError',
            message
        }

        res.status(400).json(message);
        return;
    }

    if (err.status) {
        const message = err.message;

        res.locals.logData = {
            event: 'request_error',
            error: err.name,
            message
        }

        res.status(err.status).json({ message });
        return;
    }

    if (err.name === 'CastError') {
        const message = 'Resource not found';

        res.locals.logData = {
            event: 'request_error',
            error: 'CastError',
            message
        }

        res.status(404).json({ message });
        return;
    }

    if (err.message?.includes('E11000')) {
        const message = 'Resource duplicate';

        res.locals.logData = {
            event: 'request_error',
            error: 'E11000',
            message
        }

        res.status(409).json({ message });
        return;
    }

    const message = 'Error internal server';

    res.locals.logData = {
        event: 'server_error',
        error: err.name,
        message: err.message,
        stack: err.stack
    }

    res.status(500).json({ message });
};

export const routerNotFound = (req, res) => {
    throw new createHttpError(404, 'Route Not Found');
};