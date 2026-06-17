
import { carrierFactory } from './carriers/carriers.service.js';

import { 
  buildStaticErrorResult,
  buildApiErrorResult, 
  buildRateComplete 
} from '../../domains/build.rate.result.js';

import { presentRate } from '../../presenters/rate.presenter.js';

export default async function getApiRates(agencies, input = {}) {
  const results = await Promise.all(
    agencies.map(async (agency) => {
      try {
        const carrier = carrierFactory(agency);

        if (!carrier) {
          return buildApiErrorResult({
            agency: agency.name,
            error: {
              message: 'Carrier not implemented'
            },
            presentRate
          });
        }
        
        const result = await carrier.getRates(input);

        if (!result.length) {
            return buildStaticErrorResult({
                presentRate,
                agency: agency.name,
                code: 'NO_RATE'
            });
        }

        return buildRateComplete({
          agency: agency.name,
          services: presentRate(result)
        });

      } catch (error) {

        return buildApiErrorResult({
          agency: agency.name,
          error,
          presentRate
        });
      }  
    })
  );

  return results.flat();
}