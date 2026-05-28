
import morgan from 'morgan';

import looger from './logger.js';

const stream = {
    write: (message) => {
        looger.info(message.trim());
    },
};

const httpLogger = 
    process.env.NODE_ENV === 'test'
        ? morgan("dev")
        : morgan("combined", { stream });

export default httpLogger;