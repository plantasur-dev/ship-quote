
import { auditStore } from "../services/audit.service.js";
import { sanitizer } from "../../lib/utils/sanitizer.utils.js";

const METHOD_ACTION_MAP = {
    GET: 'READ',
    POST: 'CREATE',
    PUT: 'UPDATE',
    PATCH: 'UPDATE',
    DELETE: 'DELETE'
};

const EXCLUDED_PATHS = [
    '/auth',
    '/audit'
];

function isExcluded(path) {
    return EXCLUDED_PATHS.some(excluded => path.includes(excluded));
}

function extractResource(req) {
    const parts = req.baseUrl?.split('/').filter(Boolean) ?? [];
    const resource = [...parts].reverse().find(p => !/^v\d+$/i.test(p));

    return resource ?? 'unknown';
}

export function audit(req, res, next) {
 
     if (isExcluded(req.originalUrl)) {
        return next();
    }
 
    req.audit = {
        action: null,
        resource: null,
        resourceId: null,
        response: null
    };

    const originalJson = res.json.bind(res);
    res.json = (body) => {
        if (req.audit.response === null) {
            req.audit.response = body;
        }
        return originalJson(body);
    };
 
    res.on('finish', () => {
        const input = sanitizer({
            ...req.params,
            ...req.query,
            ...req.body
        });
 
        const userId = req.session?.user?.id ?? null;
 
        const action = req.audit.action
            ?? METHOD_ACTION_MAP[req.method]
            ?? 'UNKNOWN';
 
        const resource = req.audit.resource ?? extractResource(req);
 
        auditStore({
            action,
            resource,
            resourceId: req.audit.resourceId ?? req.params?.id ?? null,
            userId,
            ip: req.ip,
            input,
            response: req.audit.response !== null ? sanitizer(req.audit.response) : null
        }).catch(error => {
            console.error("Audit error:", error);
        });
    });
 
    next();
}