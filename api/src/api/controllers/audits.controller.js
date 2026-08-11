
import createHttpError from "http-errors";

import { auditsList } from "../services/audit.service.js";

export const list = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 14;
    
    const audits = await auditsList({ page, limit });

    if (!audits.data.length) {
        throw createHttpError(404, 'Audits not founds');
    }

    return res.json(audits); 
};