
import mongoose from 'mongoose';

const packageSyncSchema = new mongoose.Schema({
    agencyCode: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    packageHash: {
        type: String,
        required: true
    },
    trigger: {
        type: String,
        enum: ['seed', 'integration'],
        default: 'seed'
    },
    source: {
        type: Object,
        default: {}
    },
    stats: {
        palletTypes: { type: Number, default: 0 },
        zones: { type: Number, default: 0 },
        zoneRules: { type: Number, default: 0 },
        rates: { type: Number, default: 0 }
    },
    appliedAt: {
        type: Date,
        default: Date.now
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

packageSyncSchema.index({ agencyCode: 1 }, { unique: true });

const PackageSync = mongoose.model('TariffSync', packageSyncSchema);

export default PackageSync;
