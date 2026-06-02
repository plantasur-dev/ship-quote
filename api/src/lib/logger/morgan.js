
import morgan, { token } from 'morgan';

import logger from './logger.js';

const loggerHandler = (type, params) => {
    switch (type) {
        case 'warn':
            logger.warn({ ...params });
            break;
        case 'error':
            logger.error({ ...params });
            break;
        default:
            logger.info('http_resquets', 
                { 
                    ...params, 
                    event: 'http_resquets' 
                });
            break;
    }
};

const loggerSetup = (status) => {
    return status >= 500 ? 'error'
        : status >= 400 ? 'warn'
        : 'info';
};

const httpLogger = morgan((tokens, req, res) => {

    const status = Number(tokens.status(req, res));

    const statusCode = loggerSetup(status);

    loggerHandler(
        statusCode, 
        {
            service: 'ship-quote-api',
            ...res?.locals.logData,
            method: tokens.method(req, res),
            path: req.path,
            status,
            responseTime: Number(
                tokens['response-time'](req, res)
            ),
            contentLength: tokens.res(
                req,
                res,
                'content-length'
            ) || 0,

            ip: tokens['remote-addr'](req, res),
            userAgent: tokens['user-agent'](req, res)
        }
    );

    return null;
});

export default process.env.NODE_ENV === 'test'
    ? morgan('dev')
    : httpLogger;