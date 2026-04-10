
import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    country_code: {
        type: String,
        required: true,
        maxlength: 2,
        uppercase: true
    },
    country_name: {
        type: String,
        required: true
    },
    admin_code: {
        type: String,
        required: true,
        uppercase: true
    },
    admin_full_code: {
        type: String,
        required: true,
        uppercase: true,
        index: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    normalized_name: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    type: {
        type: String,
        enum: ["province", "state", "region"],
        default: "province"
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

locationSchema.index({ 
    country_code: 1, 
    normalized_name: 1 
});

const Location = mongoose.model('Location', locationSchema);

export default Location;