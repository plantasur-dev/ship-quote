
import mongoose from "mongoose";

const zoneRuleSchema = new mongoose.Schema({
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agency",
        required: true
    },

    zoneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone",
        required: true
    },

    province: {
        type: String,
        required: true
    },

    isDefault: {
        type: Boolean,
        required: true
    },

    postalCodeRanges: [
        {
            from: String,
            to: String
        }
    ],
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

zoneRuleSchema.index({
    agencyId: 1,
    province: 1
});

zoneRuleSchema.index({
    agencyId: 1,
    zoneId: 1
});

zoneRuleSchema.index({
    agencyId: 1,
    province: 1,
    isDefault: 1
},
{
    unique: true,
    partialFilterExpression: {
        isDefault: true
    }
});

const ZoneRules = mongoose.model('zoneRules', zoneRuleSchema);

export default ZoneRules;