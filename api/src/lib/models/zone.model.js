
import mongoose from "mongoose";

import { 
    PRICING_MODES,
    PRICING_MODES_VALUES, 
    SHIPMENT_UNITS, 
    SHIPMENT_UNIT_VALUES 
} from '../constants/index.js';

import { invalidateAgencyTariffs } from "../../api/services/cache.service.js";

const zoneSchema = new mongoose.Schema({
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agency",
        required: [true, 'agencyId de agencia obligatorio.']
    },
    name: { 
        type: String, 
        required: [true, 'name de zona obligatorio.' ]
    },
    provinces: {
        type: [String],
    },
    calculationMode: {
        type: String,
        enum: SHIPMENT_UNIT_VALUES,
        required: [true, 'calculationMode es obligatorio.']
    },
    volumetric: {
        enabled: {
            type: Boolean,
            default: false
        },
        factor: {
            type: Number,
            default: 200
        }
    },
    pricingMode: {
        type: {
            type: String,
            enum: PRICING_MODES_VALUES,
            default: PRICING_MODES.PALLET_CLASSIFICATION,
            required: [true, 'calculationMode es obligatorio.'],
            validate: {
                validator: function (value) {
                    const allowedModes = {
                        [SHIPMENT_UNITS.PALLET]: [
                            PRICING_MODES.PALLET_CLASSIFICATION,
                            PRICING_MODES.WEIGHT_VOLUME
                            
                        ],
                        [SHIPMENT_UNITS.PARCEL]: [
                            PRICING_MODES.REAL_WEIGHT,
                            PRICING_MODES.WEIGHT_VOLUME
                        ]
                    };

                    const calculationMode = this.calculationMode;

                    return allowedModes[calculationMode]?.includes(value) ?? false;
                },
                message: 'calculationMode no es compatible con pricingMode.'
            }
        },
        tonnagePricingRule: {
            enabled: { 
                type: Boolean, 
                default: false 
            },
            threshold: { 
                type: Number, 
                default: 2001 
            },
            unit: { 
                type: String, 
                default: "€/ton" 
            }
        }
    }
}, { 
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
        },
    }
});

zoneSchema.index({ 
    agencyId: 1, 
});

zoneSchema.index({ 
    agencyId: 1, 
    provinces: 1 
});

zoneSchema.index({ 
    agencyId: 1, 
    name: 1 
},
{
    unique: true
});

zoneSchema.virtual('rates', {
    ref: 'Rate',
    localField: '_id',
    foreignField: 'zoneId'
});

zoneSchema.virtual('rules', {
    ref: 'ZoneRules',
    localField: '_id',
    foreignField: 'zoneId'
});

const triggerRefresh = () => invalidateAgencyTariffs();

zoneSchema.post('save', triggerRefresh);
zoneSchema.post('findOneAndUpdate', triggerRefresh);
zoneSchema.post('findOneAndDelete', triggerRefresh);
zoneSchema.post('deleteOne', triggerRefresh);
zoneSchema.post('updateOne', triggerRefresh);
zoneSchema.post('insertMany', triggerRefresh);

const Zone = mongoose.model("Zone", zoneSchema);

export default Zone;