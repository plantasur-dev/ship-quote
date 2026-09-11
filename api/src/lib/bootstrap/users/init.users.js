
import logger from "../../logger/logger.js";

import User from "../../models/user.model.js";

const initUser = async () => {

    const exists = await User.findOne();

    if (exists) {
        logger.info({
            event: 'user:bootstrap:skip',
            message: `User collection exite, se omit`,
            component: 'database'
        });
        return;
    }

    const userData = (process.env.NODE_ENV === 'test') ? {
        "username": "ADMIN",
        "email": "test@test.com",
        "password": "123456"
    } : {
        "username": "Root",
        "email": process.env.SHIP_ADMIN_USER,
        "password": process.env.SHIP_ADMIN_PASS
    };

    if (process.env.NODE_ENV !== 'test' && 
        (!process.env.SHIP_ADMIN_USER || !process.env.SHIP_ADMIN_PASS)
    ) {
        throw new Error('SHIP_ADMIN_USER or SHIP_ADMIN_PASS env var is not set');
    }

    const user = await User.create(userData);

    const message = (!user) ? {
        event: 'user:bootstrap:error',
        message: `Usuario default no creado`,
        component: 'database'
    } : {
        event: 'user:bootstrap:success',
        message: `Usuario default completado`,
        component: 'database'
    };

    logger.info(message);
};

export default initUser;