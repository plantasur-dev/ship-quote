
import { auditStore } from "../services/audit.service.js";

import { sanitizer } from "../../lib/utils/sanitizer.utils.js";

export function audit(req, res, next) {

    const start = Date.now();

    req.audit = {
        action: null,
        response: null
    };

    res.on('finish', () => {
        const request = {  
            params: sanitizer(req.params),
            query: sanitizer(req.query),
            body: sanitizer(req.body)
        };
        
        const userId = req.session?.user?.id ?? null;
        
        const action = req.audit.action 
            ?? (userId ? 'MANAGER' : 'UNKNOWN');

        const duration = Date.now() - start;

        auditStore({
            action,
            endpoint: req.originalUrl,
            userId,
            metadata: {
                ip: req.ip,
                method: req.method,
                userAgent: req.get('user-agent')
            },
            request,
            response: req.audit.response,
            statusCode: res.statusCode,
            duration
        }).catch(error => {
            console.error("Audit error:", error);
        });
    });

    next();
};