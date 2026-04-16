
import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    country_code: {
        type: String,
        required: [true, 'Código de país obligatorio.'],
        maxlength: [2, 'Longitud mínima de 2.'],
        uppercase: true
    },
    country_name: {
        type: String,
        required: [true, 'Nombre de país obligatorio.'],
        maxlength: [50, 'Longitud máxima de 50.'],
        set: values => normalizeString(values)
    },
    admin_code: {
        type: String,
        required: [true, 'Código provincia obligatorio.'],
        uppercase: true
    },
    admin_full_code: {
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
    normalized_name: {
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

locationSchema.index({ 
    admin_full_code: 1 
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