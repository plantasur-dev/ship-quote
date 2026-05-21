
import Agency from '../../lib/models/agency.model.js';

import PalletType from '../../lib/models/palletType.model.js';

import { palletTypesRaw } from '../../../lib/data/tecum.js';

export async function seedPalletTypesTecum() {

  const agency = await Agency.findOne({ code: 'tecum' });
  if (!agency) throw new Error('Tecum no existe');

  await PalletType.deleteMany({ agencyId: agency._id });

  const docs = palletTypesRaw.map(p => ({
    agencyId: agency._id,
    name: p.name,
    constraints: {
      maxWeight: p.maxWeight,
      maxLength: p.maxLength,
      maxWidth: p.maxWidth,
      maxHeight: p.maxHeight
    }
  }));

  await PalletType.insertMany(docs);

  console.log('✅ PalletTypes importados');
}