
import { carrierFactory } from './carriers/carriers.service.js';

import { 
  buildStaticErrorResult,
  buildApiErrorResult, 
  buildRateComplete 
} from '../../domains/build.rate.result.js';

import { presentAgencyRate } from '../../presenters/rate.presenter.js';

export default async function getApiRates(agencies, input = {}) {
  
  const { zone } = input;

  const results = await Promise.all(
    agencies.map(async (agency) => {
      try {
        const carrier = carrierFactory(agency);

        if (!carrier) {
          return presentAgencyRate(
            buildApiErrorResult({
              agency: agency.name,
              zone,
              error: {
                message: 'Carrier not implemented'
              },
            })
          );
        }
        
        const result = await carrier.getRates(input);

        if (!result.length) {
          return presentAgencyRate( 
            buildStaticErrorResult({
              agency: agency.name,
              zone,
              code: 'NO_RATE'
            })
          );
        }

        return presentAgencyRate(
          buildRateComplete({
            agency: agency.name,
            zone,
            services: result
          })
        );

      } catch (error) {

        return presentAgencyRate( 
          buildApiErrorResult({
            agency: agency.name,
            zone,
            error,
          })
        );
      }  
    })
  );

  return results.flat();
}