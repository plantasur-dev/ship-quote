
import mongoose from "mongoose";

const palletTypeSchema = new mongoose.Schema({
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agency",
        required: [true, 'Campo id Agencia obligatorio.'],
        index: true
    },
    name: { 
        type: String,
        maxLength: [60, 'Longitud máxima de 60 caracteres.'], 
        required: [true, 'Campo descripción pallet obligatorio.']
    },
    constraints: {
        maxWeight: {
            type: Number,
            min: 0,
            required: [true, 'Campo peso pallet obligatorio.']
        },
        maxHeight: {
            type: Number,
            min: 0,
            default: 0,
            set: value => sanitizeInput(value)
        },
        maxLength: {
            type: Number,
            min: 0,
            default: 0,
            set: value => sanitizeInput(value)
        },
        maxWidth: {
            type: Number,
            min: 0,
            default: 0,
            set: value => sanitizeInput(value)
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

const sanitizeInput = (value) => 
    (value === "" || value == null ? 0 : Number(value))

const PalletType = mongoose.model("PalletType", palletTypeSchema);

export default PalletType;