
import { logResult, SEED_STATUS } from "../../utils/seed.utils.js";
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
       logResult({
            status: SEED_STATUS.UNCHANGED,
            code: 'Packages users', 
            message: `Default user already exists`,
            errors: [],
            warnings: []
        });
        return;
    }

    await User.create({
        username: isTest ? "ADMIN" : "Root",
        email,
        password,
    });

    logResult({
        status: SEED_STATUS.APPLIED,
        code: 'Packages users', 
        message: `Default admin user created`,
        errors: [],
        warnings: []
    });
};

export default initUser;