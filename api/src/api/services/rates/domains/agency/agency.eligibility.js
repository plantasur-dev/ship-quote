
import { SHIPMENT_UNITS } from '../../../../../lib/constants/index.js';

export function isAgencyEligibleFor(agency, presentUnits) {
    const { supportsPallets, supportsParcels } = agency.rules;

    return (
        (presentUnits.has(SHIPMENT_UNITS.PALLET) && supportsPallets) ||
        (presentUnits.has(SHIPMENT_UNITS.PARCEL) && supportsParcels)
    );
}

export function filterEligibleAgencies(agencies, items) {
    const presentUnits = new Set(
        items
            .filter(item =>
                item.typeServices === SHIPMENT_UNITS.PALLET ||
                item.typeServices === SHIPMENT_UNITS.PARCEL
            )
            .map(item => item.typeServices)
    );

    return agencies.filter(agency => isAgencyEligibleFor(agency, presentUnits));
}

export function filterItemsBySupportedUnits(agency, items) {
    const { supportsPallets, supportsParcels } = agency.rules;

    return items.filter(item =>
        (item.typeServices === SHIPMENT_UNITS.PALLET && supportsPallets) ||
        (item.typeServices === SHIPMENT_UNITS.PARCEL && supportsParcels)
    );
}