
import morgan, { token } from 'morgan';

import looger from './logger.js';

const httpLogger = morgan((tokens, req, res) => {
    looger.info('HTTP Request', {
        type: 'http',
        method: tokens.method(req, res),
        route: tokens.url(req, res),
        status: Number(tokens.status(req, res)),
        responseTime: Number(
            tokens['response-time'](req, res)
        ),
        contentLength: tokens.res(
            req,
            res,
            'content-length'
        ),

        ip: tokens['remote-addr'](req, res),

        referrer: tokens.referrer(req, res),

        userAgent: tokens['user-agent'](req, res)
    });

    return null;
});

export default process.env.NODE_ENV === 'test'
    ? morgan('dev')
    : httpLogger;