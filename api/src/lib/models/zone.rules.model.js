
import mongoose from "mongoose";

import { invalidateAgencyTariffs } from "../../api/services/cache.service.js";

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
        required: true,
        default: function () {
            return !this.postalCodeRanges.length
        }
    },

    postalCodeRanges: [{
        from: String,
        to: String,
        kind: {
            type: String,
            enum: ["exception", "prefix"]
        }
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

const triggerRefresh = () => invalidateAgencyTariffs();

zoneRuleSchema.post('save', triggerRefresh);
zoneRuleSchema.post('findOneAndUpdate', triggerRefresh);
zoneRuleSchema.post('findOneAndDelete', triggerRefresh);
zoneRuleSchema.post('deleteOne', triggerRefresh);
zoneRuleSchema.post('updateOne', triggerRefresh);
zoneRuleSchema.post('insertMany', triggerRefresh);

const ZoneRules = mongoose.model('ZoneRules', zoneRuleSchema);

export default ZoneRules;