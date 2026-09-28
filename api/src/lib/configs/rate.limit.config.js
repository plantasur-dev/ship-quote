
import { rateLimit } from 'express-rate-limit';

export const publicLimiter = rateLimit({
	windowMs: 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
    message: {
        message: 'Too many requests, please try again later.'
    }
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { 
        message: 'Demasiados intentos de inicio de sesión. Inténtalo más tarde.' 
    }
});