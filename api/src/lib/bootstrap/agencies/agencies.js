
import Agency from '../../models/agency.model.js';

import agenciesData from '../../data/agency.js';

import logger from '../../logger/logger.js';

export const agencies = async () => {
    try {
        const exists = await Agency.findOne();

        if (exists) {
            logger.info({
                event: 'agencies:bootstrap:skip',
                message: `Agencias ya existen, se omite`,
                component: 'database'
            });
            return;
        }

        await Agency.insertMany(agenciesData);

        logger.info({
            event: 'agencies:bootstrap:success',
            message: `Agencias completado`,
            component: 'database'
        });

    } catch (error) {
        logger.error({
            event: 'agencies:bootstrap:error',
            message: `Error en agencias: ${ error }`,
            component: 'database'
        });

        process.exit(1);
    }
};