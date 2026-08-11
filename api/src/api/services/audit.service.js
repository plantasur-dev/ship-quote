
import Audit from "../../lib/models/audit.model.js";

export const auditStore = async (auditResponse) => 
    await Audit.create(auditResponse);

export const auditsList = async ({ page = 1, limit = 10 }) => {

    const startIndex = (page - 1) * limit;
    
    const [audits, total] = await Promise.all([
        Audit.find()
            .limit(limit)
            .skip(startIndex),
        Audit.countDocuments()
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
    