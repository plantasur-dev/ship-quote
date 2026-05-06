
import mongoose from "mongoose";

const agencySchema = new mongoose.Schema({
    name: { 
        type: String,
        trim: true,
        required: [true, 'Nombre de agencia es obligatorio.'],
        minLength: [3, 'Longitud mínima de 3 caracteres.'],
        maxLength: [14, 'Longitud máxima de 14 caracteres.'],
        set: values => { 
            return values
            .trim()
            .toLowerCase()
            .split(' ')
            .map(value => 
                value.charAt(0).toUpperCase() + 
                value.slice(1))
            .join(' ') 
        }
    },
    code: { 
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Código de agencia obligatorio.'],
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
        enum: ["static", "api", "hybrid"],
        default: "static"
    },
    active: {
        type: Boolean,
        default: true
    },
    rules: {
        hasAndaluciaRule: { 
            type: Boolean, 
            default: false 
        },
        supportsPallets: { 
            type: Boolean, 
            default: true 
        },
        supportsParcels: { 
            type: Boolean, 
            default: false 
        }
    },
    apiConfig: {
        timeout: { 
            type: Number, 
            default: 3000,
        },
        baseUrlApi: { 
            type: String,
            required: function () {
                return this.type === 'api'
            },
        },
        endpoints: {
            quotations: String,
            transportOrders: String
        },
        apiKey: { 
            type: String,
            required: function () {
                return this.type === 'api'
            },
        },
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

agencySchema.index({ code: 1 }, { unique: true });

const Agency = mongoose.model("Agency", agencySchema);

export default Agency;