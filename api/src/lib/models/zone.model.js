
import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema({
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agency",
        require: true,
        index: true
    },
    name: { 
        type: String, 
        required: true 
    },
    provinces: {
        type: [String]
    },
    calculationMode: {
        type: String,
        enum: ["pallet", "weight_volume"],
        default: "pallet"
    },
    postalCodeExceptions: [{
        from: String,
        to: String,
        zoneName: String
    }]
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
    provinces: 1 
});

const Zone = mongoose.model("Zone", zoneSchema);

export default Zone;