
import Agency from '../../models/agency.model.js';

import agenciesData from '../../data/agency.js';

export const agencies = async () => {
    try {
        const exists = await Agency.findOne();

        if (exists) {
            console.log('Agencias ya existen, se omite');
            return;
        }

        console.log('🌱 Insertando agencias...');
        await Agency.insertMany(agenciesData);

        console.log('✅ agencias completado');
    } catch (error) {
        console.error('❌ Error en agencias:', error);
        process.exit(1);
    }
};