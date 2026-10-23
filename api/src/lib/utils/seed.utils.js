
import logger from '../logger/logger.js';

export const SEED_STATUS = Object.freeze({
    APPLIED: 'applied',
    UNCHANGED: 'unchanged',
    WOULD_APPLY: 'would-apply',
    FAILED: 'failed'
});

const logLevel = status => status === SEED_STATUS.FAILED ? 'error' : 'info';

export function logResult(result) {
    logger[logLevel(result.status)]({
        event: `tariffs:seed:${ result.status }`,
        service: 'ship-quote-api',
        component: 'database',
        message: `${ result.code }: ${ result.message }`,
        warnings: result.warnings?.length ?? 0,
        ...(result.counts ? { counts: result.counts } : {}),
        ...(result.status === SEED_STATUS.FAILED
            ? { issues: result.errors.slice(0, 10).map(issue => `${ issue.code }: ${ issue.message }`) }
            : {})
    });
}