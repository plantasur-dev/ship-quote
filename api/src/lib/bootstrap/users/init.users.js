
import logger from "../../logger/logger.js";

import User from "../../models/user.model.js";

const initUser = async () => {

    const isTest = process.env.NODE_ENV === "test";

    if (!isTest && 
        (!process.env.SHIP_ADMIN_USER || !process.env.SHIP_ADMIN_PASS)
    ) {
        throw new Error('SHIP_ADMIN_USER or SHIP_ADMIN_PASS env var is not set');
    }

    const email = isTest
        ? "test@test.com"
        : process.env.SHIP_ADMIN_USER;

    const password = isTest
        ? "123456"
        : process.env.SHIP_ADMIN_PASS;

    if (!email || !password) {
        throw new Error(
            "Admin credentials are not configured"
        );
    }

    const exists = await User.findOne({ email });

    if (exists) {
        logger.info({
            event: 'user:bootstrap:skip',
            message: `Default user already exists`,
            component: 'database'
        });
        return;
    }

    await User.create({
        username: isTest ? "ADMIN" : "Root",
        email,
        password,
    });

    logger.info({
        event: "user:bootstrap:success",
        message: "Default admin user created",
        component: "database",
    });
};

export default initUser;