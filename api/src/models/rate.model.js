
import mongoose from "mongoose";

const priceBreakSchema = new mongoose.Schema({
    min: Number,
    max: Number,
    price: Number
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
    priceBreaks: {
        type: [priceBreakSchema]
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