
import morgan, { token } from 'morgan';

import logger from './logger.js';

const logHttpRequest = (type, params) => {
    const method = ['warn', 'error'].includes(type) 
        ? type 
        : 'info';

    if (type !== 'info') {
        return logger[method]({ ...params });;
    }

    logger.info('http_requests', { 
        ...params, 
        event: 'http_requests' 
    });
};

const getLogLevelFromStatus = (status) => {
    return status >= 500 
        ? 'error'
        : status >= 400 
            ? 'warn'
            : 'info';
};

const httpLogger = morgan((tokens, req, res) => {

    const status = Number(tokens.status(req, res));

    const logLevel = getLogLevelFromStatus(status);

    logHttpRequest(
        logLevel, 
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