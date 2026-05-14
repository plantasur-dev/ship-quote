
import { carrierMap } from './carriers.map.js';

export function carrierFactory(agency) {
    
    const CarrierClass = carrierMap[agency.code];

    if (!CarrierClass) return null;

    return new CarrierClass(agency);
}