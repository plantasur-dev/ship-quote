
import mongoose from "mongoose";

const agencySchema = new mongoose.Schema({
    name: { 
        type: String,
        trim: true,
        required: true 
    },
    code: { 
        type: String,
        trim: true,
        lowercase: true,
        required: true, 
        unique: true 
    },
    type: {
        type: String,
        enum: ["static", "api"],
        default: "static"
    },
    active: {
        type: Boolean,
        default: true
    },
    rules: {
        hasAndaluciaRule: { 
            type: Boolean, 
            default: false 
        },
        supportsPallets: { 
            type: Boolean, 
            default: true 
        },
        supportsParcels: { 
            type: Boolean, 
            default: false 
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

const Agency = mongoose.model("Agency", agencySchema);

export default Agency;