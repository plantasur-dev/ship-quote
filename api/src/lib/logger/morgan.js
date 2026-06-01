
import morgan, { token } from 'morgan';

import looger from './logger.js';

const httpLogger = morgan((tokens, req, res) => {
    looger.info({
        event: 'http_request',
        method: tokens.method(req, res),
        path: req.path,
        status: Number(tokens.status(req, res)),
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
    });

    return null;
});

export default process.env.NODE_ENV === 'test'
    ? morgan('dev')
    : httpLogger;