
import mongoose from "mongoose";

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
        enum: ["pallet", "parcel"],
        default: "pallet"
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
            enum: ["weight", "weight_volume"],
            default: "weight"
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

const Zone = mongoose.model("Zone", zoneSchema);

export default Zone;