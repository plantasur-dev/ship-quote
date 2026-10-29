
import mongoose from "mongoose";

import { 
    CALCULATION_TYPES_RATE,
    CALCULATION_TYPES_RATE_ARRAY,
    SHIPMENT_UNIT_ARRAY,
    SERVICE_NAMES,
    SERVICE_NAMES_ARRAY
 } from "../constants/index.js";

import { invalidateAgencyTariffs } from "../../api/services/cache.service.js";

const rangeAmountSchema = new mongoose.Schema({
    min: Number,
    max: Number,
    price: Number
},
{
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
        },
    }
});

const priceBreakPricingSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['fixed', 'per_weight_unit'],
        required: true
    },
    unitKg: {
        type: Number,
        min: 0,
        validate: {
            validator: value => value > 0,
            message: 'unitKg must be greater than zero'
        },
        required: function () {
            return this.type === 'per_weight_unit';
        }
    },
    unit: String
}, {
    _id: false,
    versionKey: false
});

const priceBreakSchema = new mongoose.Schema({
    min: Number,
    max: Number,
    price: Number,
    pricing: priceBreakPricingSchema
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

const surchargeSchema = new mongoose.Schema({
    extraKg: {
        enabled: {
            type: Boolean,
            default: false
        },
        pricePerKg: {
            type: Number,
            default: 0
        }
    },

    fixedSurcharge: {
        enabled: {
            type: Boolean,
            default: false
        },

        calculateByQuantity: {
            type: Boolean,
            default: false
        },

        price: {
            type: Number,
            default: 0
        }
    },

    dimensionRanges: [rangeAmountSchema],

    multiParcelExcess: {
        enabled: {
            type: Boolean,
            default: false
        },

        thresholdKg: {
            type: Number,
            default: 40
        },

        divisor: {
            type: Number,
            default: 1
        },

        pricePerBlock: {
            type: Number,
            default: 0
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


const servicePriceSchema = new mongoose.Schema({
    service: {
        type: String,
        enum: SERVICE_NAMES_ARRAY,
        default: SERVICE_NAMES.BASIC
    },

    priceBreaks: [priceBreakSchema],
        
    fallbackToLastPrice: {
        type: Boolean,
        default: false
    },

    surcharges: surchargeSchema,

    limits: {
        maxWeight: {
            type: Number,
            default: 0
        },
        maxLength: {
            type: Number,
            default: 0
        },
        maxSumDimensions: {
            type: Number,
            default: 0
        }
    },
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

const rateSchema = new mongoose.Schema({
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agency",
        required: true,
        index: true
    },
    zoneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone"
    },
    palletTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PalletType",
        default: null
    },
    type: {
        type: String,
        enum: SHIPMENT_UNIT_ARRAY,
        required: true
    },
    zoneName: { 
        type: String, 
        required: true 
    },
    services: {
        type: [servicePriceSchema]
    },
    calculationType: {
        type: String,
        enum: CALCULATION_TYPES_RATE_ARRAY,
        default: CALCULATION_TYPES_RATE.UNIT
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

rateSchema.index({ 
    agencyId: 1, 
    type: 1, 
    zoneName: 1 
});

const triggerRefresh = () => invalidateAgencyTariffs();

rateSchema.post(
    [
        'save', 
        'findOneAndUpdate', 
        'findOneAndDelete', 
        'deleteOne', 
        'updateOne',
        'insertMany'
    ], 
    triggerRefresh
);

const Rate = mongoose.model("Rate", rateSchema);

export default Rate;