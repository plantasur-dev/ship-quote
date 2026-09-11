
import mongoose from 'mongoose';

const sessionSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    expireAt: {
        type: Date,
        expires: 0,
        default: () => {
            const dateNow = new Date();
            dateNow.setDate(dateNow.getDate() + 2);

            return dateNow;
        }
    }
},
{
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
        },
    }
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;