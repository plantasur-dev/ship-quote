
import mongoose from "mongoose";

export const AUDIT_ACTIONS = [
    'CREATE',
    'READ',
    'UPDATE',
    'DELETE',
    'LOGIN',
    'EXPORT',
    'TARIFF_SEARCH',
    'UNKNOWN'
];

const auditSchema = new mongoose.Schema({

    action: {
        type: String,
        enum: AUDIT_ACTIONS,
        default: 'UNKNOWN',
        index: true
    },

    resource: {
        type: String,
        index: true
    },

    resourceId: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        index: true
    },

    ip: {
        type: String,
        index: true
    },

    input: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    response: {
        type: mongoose.Schema.Types.Mixed,
        default: null
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

auditSchema.index({ resource: 1, action: 1, createdAt: -1 });
auditSchema.index({ ip: 1, createdAt: -1 });
auditSchema.index({ userId: 1, createdAt: -1 });
auditSchema.index({ createdAt: -1 });
auditSchema.index({ 'input.destinationPostalCode': 1, createdAt: -1 });

const Audit = mongoose.model('Audit', auditSchema);

export default Audit;