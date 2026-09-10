
import createHttpError from "http-errors";
import { 
    getAuditsList, 
    getAuditsRecentActivity,
    getAuditDetail,
    getMostQueriedValue,
    getStats
} from "../services/audit.service.js";


export const list = async (req, res) => {
    const audits = await getAuditsList({ ...req.query });

    return res.json(audits);    
};

export const detail = async (req, res) => {
    const audit = await getAuditDetail(req.params.activityId);

    if (!audit) {
        throw createHttpError(404, 'Activity audit not found');
    }

    return res.json(audit); 
}

export const recentActivity = async (req, res) => {
    const recent = await getAuditsRecentActivity({ ...req.query });

    return res.json(recent);
};

export const mostQueriedPostalCode = async (req, res) => {
    const mostQueriedValue = await getMostQueriedValue();

    return res.json(mostQueriedValue);
};

export const stats = async (req, res) => {
    const statsData = await getStats();

    return res.json(statsData);
 };