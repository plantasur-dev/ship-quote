
import createHttpError from 'http-errors';

import mongoose from 'mongoose';

import User from '../../lib/models/user.model.js';

import Session from '../../lib/models/session.model.js';

export async function create(req, res) {
    
    const { username, email, password } = req.body;

    const user = await User.create({
        username,
        email,
        password
    });

    res.status(201).json(user);
};

export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) throw createHttpError(400, 'Fields required');

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, 'Invalid email or password');

    const match = await user.checkPassword(password);
    if (!match) throw createHttpError(404, 'Invalid email or password');

    const session = await Session.create({ user: user.id });

    res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: process.env.COOKIE_SECURE === 'true' ? 'none' : undefined,
        maxAge: 2 * 24 * 60 * 60 * 1000
    });

    res.json(user);
}

export async function logout(req, res) {
    await Session.findByIdAndDelete(req.session._id);

    res.status(204).end();
}

export function verify(req, res) {
    res.json(req.session.user);
}