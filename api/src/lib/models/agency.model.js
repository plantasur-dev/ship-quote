
import mongoose from "mongoose";

import { 
    SCOPE_TYPES, 
    SCOPE_TYPES_ARRAY,
    AGENCY_TYPE,
    AGENCY_TYPE_ARRAY
} from "../constants/index.js";

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
        required: [true, 'Código de agencia obligatorio.']
    },
    type: {
        type: String,
        enum: {
            values: AGENCY_TYPE_ARRAY,
            message: "El tipo de agencia debe ser static, api o hybrid"
        },
        default: AGENCY_TYPE.STATIC
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
        },
        coverage: {
            type: [String],
            enum: SCOPE_TYPES_ARRAY,
            default: [SCOPE_TYPES.NATIONAL]
        }
    },
    supplements: {
        fuelSurcharge: {
            enabled: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                enum: ["percentage", "fixed"],
                default: "percentage"
            },
            value: {
                type: Number,
                default: 0
            }
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
                return this.type === AGENCY_TYPE.API || 
                    this.type === AGENCY_TYPE.HYBRID
            },
        },
        endpoints: {
            quotations: String,
            transportOrders: String
        },
        apiKey: { 
            type: String,
            required: function () {
                return this.type === AGENCY_TYPE.API || 
                    this.type === AGENCY_TYPE.HYBRID
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
            
            if (ret.apiConfig){
                delete ret.apiConfig.apiKey;
            }
        },
    }
});

agencySchema.index({ code: 1 }, { unique: true });

agencySchema.pre("validate", function () {
    if (this.name) {
        this.code = this.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase()
            .split(/\s+/)
            .join("_");
    }
});

const Agency = mongoose.model("Agency", agencySchema);

export default Agency;