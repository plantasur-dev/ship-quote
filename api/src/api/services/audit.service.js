
import Agency from "../../lib/models/agency.model.js";
import Audit from "../../lib/models/audit.model.js";
import User from "../../lib/models/user.model.js";

function dateMatch(from, to) {
    if (!from && !to) return {};
    const createdAt = {};
    if (from) createdAt.$gte = new Date(from);
    if (to) createdAt.$lte = new Date(to);
    return { createdAt };
}

function dateComparison() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    return { startOfToday, startOfYesterday };
}

export const auditStore = async (data) => 
    await Audit.create(data);

export const getAuditsList = async ({ page = 1, limit = 14, criteria = {}, startDate }) => {

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 14;

    if (startDate) {
        const startDate = new Date(pstartDate);
        startDate.setHours(0, 0, 0, 0);

        criteria.createdAt = { $gte: startDate };
    }

    criteria.endpoint = { $not: /audits/ }
    
    const startIndex = (page - 1) * limit;
    
    const [audits, total] = await Promise.all([
        Audit.find({ ...criteria })
        .sort({ createdAt: -1 })
        .populate({
            path: 'userId',
            select: 'email username'
        })
        
        .limit(limit)
        .skip(startIndex),

        Audit.countDocuments({ ...criteria })
    ]);
    
    if (audits.length === 0) return { data: audits };
    
    const totalPages = Math.ceil(total / limit);

    return {
        data: audits,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    }
}

export async function getAuditsRecentActivity({ limit = 9, action = '' } = {}) {
    const criteria = {};

    if (action) criteria.action = action;

    return await Audit.find(criteria)
        .populate({
            path: 'userId',
            select: 'email username'
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
}

export async function getAuditDetail(auditId) {
    return await Audit.findById(auditId).lean();
}

export async function getActivityTimeSeries({ from, to, granularity = 'day' } = {}) {
    const dateFormat = granularity === 'hour' ? '%Y-%m-%dT%H:00:00' : '%Y-%m-%d';
    return Audit.aggregate([
        { $match: dateMatch(from, to) },
        {
            $group: {
                _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
                total: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
}

export async function getMostQueriedValue({ field = 'destinationPostalCode', from, to, limit = 20 } = {}) {
    return Audit.aggregate([
        {
            $match: {
                ...dateMatch(from, to),
                [`input.${field}`]: { $exists: true, $ne: null }
            }
        },
        {
            $group: {
                _id: `$input.${field}`,
                total: { $sum: 1 }
            }
        },
        { $sort: { total: -1 } },
        { $limit: limit }
    ]);
}
 
export async function getTopIps({ from, to, limit = 20 } = {}) {
    return Audit.aggregate([
        { $match: dateMatch(from, to) },
        {
            $group: {
                _id: '$ip',
                total: { $sum: 1 },
                resources: { $addToSet: '$resource' },
                lastSeen: { $max: '$createdAt' }
            }
        },
        { $sort: { total: -1 } },
        { $limit: limit }
    ]);
}

export async function getStats() {
    const { startOfToday, startOfYesterday } = dateComparison();

    const [
        countAgencies, 
        activeOfTodaySession, 
        activeOfYesterdaySession,
        tariffSearchOfToday,
        tariffSearchOfYesterday,
    ] = await Promise.all([
        Agency.countDocuments(),
        User.countDocuments({
            createdAt: { $gte: startOfToday }
        }),
        User.countDocuments({
            createdAt: { $gte: startOfYesterday, $lt: startOfToday }
        }),
        Audit.countDocuments({
            action: 'TARIFF_SEARCH',
            createdAt: { $gte: startOfToday }
        }),
        Audit.countDocuments({
            action: 'TARIFF_SEARCH',
            createdAt: { $gte: startOfYesterday, $lt: startOfToday }
        })
    ]);

    return { 
        countAgencies, 
        activeOfTodaySession, 
        activeOfYesterdaySession, 
        tariffSearchOfToday, 
        tariffSearchOfYesterday 
    };    
}