
import { carrierFactory } from '../carriers/carriers.service.js';

export async function getApiRates(agencies, input) { 

  const results = await Promise.allSettled(
    agencies.map(async (agency) => {
      const carrier = carrierFactory(agency);
      
      return carrier.getRates(input);
    })
  );
 
  return results.map((res, i) => {
    const agency = agencies[i];

    if (res.status === "fulfilled") {
      return {
        agency: agency.name,
        ...res.value
      };
    }

    return {
      agency: agency.name,
      available: false,
      reason: "Error API"
    };
  });
}