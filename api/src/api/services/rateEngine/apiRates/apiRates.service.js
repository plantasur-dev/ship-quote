
import { carrierFactory } from './carriers/carriers.service.js';

export default async function getApiRates(agencies, input) {
  const results = await Promise.all(
    agencies.map(async (agency) => {
      try {
        const carrier = carrierFactory(agency);

        if (!carrier) {
          return {
            agency: agency.name,
            available: false,
            reason: "API Error: Not Implemented"
          }
        }
        
        const services = await carrier.getRates(input);

        return {
          agency: agency.name,
          available: true,
          ...services
        }
      } catch (error) {
        return {
          agency: agency.name,
          available: false,
          reason: `API (${ error?.status }) Error from provider: ${ error?.message }`
        };
      }  
    })
  );

  return results;
}