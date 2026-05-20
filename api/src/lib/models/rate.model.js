
import mongoose from "mongoose";

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
        enum: ['economy', 'premium', 'express', 'basic'],
        default: 'basic'
    },

    priceBreaks: [rangeAmountSchema],

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
    type: {
        type: String,
        enum: ["pallet", "parcel"],
        required: true
    },
    zoneName: { 
        type: String, 
        required: true 
    },
    palletTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PalletType",
        default: null
    },
    services: {
        type: [servicePriceSchema]
    },
    calculationType: {
        type: String,
        enum: ["unit", "quantity"],
        default: "unit"
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

const Rate = mongoose.model("Rate", rateSchema);

export default Rate;