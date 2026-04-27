
import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    countryCode: {
        type: String,
        required: [true, 'Código de país obligatorio.'],
        maxlength: [2, 'Longitud mínima de 2.'],
        uppercase: true
    },
    countryName: {
        type: String,
        required: [true, 'Nombre de país obligatorio.'],
        maxlength: [50, 'Longitud máxima de 50.'],
        set: values => normalizeString(values)
    },
    adminCode: {
        type: String,
        required: [true, 'Código provincia obligatorio.'],
        uppercase: true
    },
    adminFullCode: {
        type: String,
        required: [true, 'Código admin provincia obligatorio.'],
        uppercase: true        
    },
    name: {
        type: String,
        required: [true, 'Nombre de provincia obligatorio.'],
        maxlength: [50, 'Longitud máxima de 50.'],
        set: values => normalizeString(values)
    },
    normalizedName: {
        type: String,
        required: [true, 'Nombre de provincia normalizado obligatorio.'],
        lowercase: true,
        index: true,
        set: values => {
            return values
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .join('_')
        }
    },
    postalCode: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 2,
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
    countryCode: 1, 
    normalizedName: 1 
});

locationSchema.index({ 
    adminFullCode: 1 
}, { unique: true });

function normalizeString(values) {
    return values
        .trim()
        .toLowerCase()
        .split(' ')
        .map(value => 
            value.charAt(0).toUpperCase() + 
            value.slice(1))
        .join(' '); 
}

const Location = mongoose.model('Location', locationSchema);

export default Location;