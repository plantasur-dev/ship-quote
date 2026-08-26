
import createHttpError from "http-errors";

import { auditsList } from "../services/audit.service.js";

export const list = async (req, res) => {

    const criteria = {};

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 14;

    if (req.query.startDate) {
        const startDate = new Date(req.query.startDate);
        startDate.setHours(0, 0, 0, 0);

        criteria.createdAt = { $gte: startDate };
    }

    criteria.endpoint = { $not: /audits/ }

    const audits = await auditsList({ page, limit, criteria });

    if (!audits.data.length) {
        throw createHttpError(404, 'Audits not founds');
    }

    return res.json(audits);    
};