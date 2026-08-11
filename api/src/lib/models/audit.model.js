
import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({

    action: {
        type: String
    },

    endpoint: {
        type: String
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    duration: {
        type: Number
    },

    statusCode: {
        type: Number
    },

    request: {
        params: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        query: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        body: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },

    response: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

    metadata: {
        ip: {
            type: String
        },
        method: {
            type: String
        },
        userAgent: {
            type: String
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

auditSchema.index({ userId: 1, createdAt: -1 });
auditSchema.index({ action: 1, createdAt: -1 });
auditSchema.index({ createdAt: -1 });
auditSchema.index({ statusCode: 1, createdAt: -1 });

const Audit = mongoose.model('Audit', auditSchema);

export default Audit;