
import Agency from '../../lib/models/agency.model.js';

import agencies from '../../lib/data/agency.js';

export const seedAgencies = async () => {
    try {
        console.log('🧹 Limpiando colección...');
        await Agency.deleteMany();

        console.log('🌱 Insertando agencias...');
        await Agency.insertMany(agencies);

        console.log('✅ Seed completado');
    } catch (error) {
        console.error('❌ Error en seed:', error);
        process.exit(1);
    }
};