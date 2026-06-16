
import PalletType from '../../../models/palletType.model.js';

import { palletTypesRaw } from '../../../data/tecum.js';

import { checkExists, loggerMsg } from '../../../utils/logger.utils.js';

const params = { 
  code: 'tecum', 
  collection: 'palletType'
};

export async function palletTypesTecum() {

  const result = await checkExists(params);

  if (!result) return;

  const { agency, model } = result;

  await model.deleteMany({ agencyId: agency._id });

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

  await model.insertMany(docs);

  loggerMsg({ 
    status: 'success',
    collection: params.collection,
    message: `${ params.code } ${ params.collection } importadas correctamente`,
  });
}