
import logger from "../../logger/logger.js";

import User from "../../models/user.model.js";

export const registerDefaultUser = async () => {

    const userData = {
        "username": "ADMIN",
        "email": "test@test.com",
        "password": "123456"
    };

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