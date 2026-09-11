
import createHttpError from "http-errors";
import Session from "../../lib/models/session.model.js";

export async function checkAuth(req, res, next) {
    
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