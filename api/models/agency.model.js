
import mongoose from "mongoose";

const agencySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    code: { 
        type: String, 
        required: true, 
        unique: true 
    },
    type: {
        type: String,
        enum: ["static", "api"],
        default: "static"
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