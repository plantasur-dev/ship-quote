
import createHttpError from "http-errors";
import Session from "../../lib/models/session.model.js";

const whiteList = [
    { method: 'POST', path: '/auth/login' },
    { method: 'POST', path: '/rates/compare/postal-code' },
    { method: 'GET', path: '/releases/latest' },
    { method: 'GET', path: '/locations/countries' },
    { method: 'GET', path: '/locations/provinces' }
];

export async function checkAuth(req, res, next) {

    const ispublic = whiteList.some(item => 
        item.path === req.path && item.method === req.method
    );

    if (ispublic) {
        next();
        return;
    }
    
    const sessionId = req.headers.cookie?.match(/sessionId=([^;]+)/)?.[1];
    
    if (!sessionId) {
        throw createHttpError(401, 'Unauthorized');
    }

    const session = await Session.findById(sessionId).populate('user');

    if (!session || !session.user) {
        throw createHttpError(401, 'Unauthorized');
    }

    if (session.expireAt < new Date()) {
        throw createHttpError(401, 'Expired session');
    }

    req.session = session;

    next();
}