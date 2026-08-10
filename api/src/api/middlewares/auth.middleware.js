
import createHttpError from "http-errors";

import Session from "../../lib/models/session.model.js";

export async function checkAuth(req, res, next) {

    if (req.method === 'POST' && req.path === '/auth/signup') {
        next();
        return;
    }

    if (req.method === 'POST' && req.path === '/auth/login') {
        next();
        return;
    }

    if (req.method === 'POST' && req.path === '/rates/compareByPostalCode') {
        next();
        return;
    }

    if (req.method === 'GET' && req.path === '/releases/latest') {
        next();
        return;
    }
    
    const sessionId = req.headers.cookie?.match(/sessionId=([^;]+)/)?.[1];
    
    if (!sessionId) {
        throw createHttpError(401, 'Unauthorized');
    }

    const session = await Session.findById(sessionId).populate('user');

    if (!session) {
        throw createHttpError(401, 'Unauthorized');
    }

    req.session = session;

    next();
}