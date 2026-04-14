
import mongoose from "mongoose";

const palletTypeSchema = new mongoose.Schema({
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agency",
        index: true
    },
    name: { 
        type: String, 
        required: true 
    },
    constraints: {
        maxWeight: Number,
        maxVolume: Number,
        maxHeight: Number,
        maxLength: Number,
        maxWidth: Number
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

const PalletType = mongoose.model("PalletType", palletTypeSchema);

export default PalletType;