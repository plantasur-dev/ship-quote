
import Audit from "../../lib/models/audit.model.js";

export const auditStore = async (auditResponse) => 
    await Audit.create(auditResponse);

export const auditsList = async (params = {}) => {
    
    const { page = 1, limit = 10, criteria } = params;

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
    