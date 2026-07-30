
export const PRICING_MODES = {
    PALLET_CLASSIFICATION: 'pallet_classification',     // pallet único
    REAL_WEIGHT: 'real_weight',                         // peso real, sin volumétrico
    WEIGHT_VOLUME: 'weight_volume'                      // máx(peso real, peso volumétrico)
};

export const PRICING_MODES_BY_CALCULATION_MODE = {
    pallet: ["pallet_classification", "weight_volume"],
    parcel: ["real_weight", "weight_volume"]
};