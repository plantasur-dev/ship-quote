
import User from '../../src/lib/models/user.model.js';
import Session from '../../src/lib/models/session.model.js';

export async function createAuthenticatedUser(overrides = {}) {
    const user = await User.create({
        username: overrides.username ?? 'tester',
        email: overrides.email ?? 'tester@example.com',
        password: overrides.password ?? 'password123'
    });

    const session = await Session.create({ user: user._id });

    return {
        user,
        session,
        cookie: `sessionId=${ session.id }`
    };
}