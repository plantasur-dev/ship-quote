
import { useState } from "react";

function ItemDraftForm({ onAddItem }) {

    const [itemDraft, setItemDraft ] = useState({
        typeServices: "",
        large: "",
        width: "",
        height: "",
        weight: ""
    });

    const [errors, setErrors] = useState({});
    
    const handleChange = (field, value) => {
        validateClean(field);
        setItemDraft(prev => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        const errors = {};

        const isInvalidNumber = (value) => {
            const n = Number(value);
            return isNaN(n) || n <= 0;
        };

        if (!itemDraft.typeServices || itemDraft.typeServices.length === 0) {
            errors.typeServices = 'Selecciona un tipo';
        }

        if (isInvalidNumber(itemDraft.large)) {
            errors.large = 'Largo requerido';
        }

        if (isInvalidNumber(itemDraft.width)) {
            errors.width = 'Ancho requerido';
        }

        if (isInvalidNumber(itemDraft.height)) {
            errors.height = 'Altura requerida';
        }

        if (isInvalidNumber(itemDraft.weight)) {
            errors.weight = 'Peso debe ser superior a 0';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const validateClean = (field) => {
        errors[field] = false;
        setErrors(errors);
    };

    const handleAddItem = async () => {
        if (!validate()) return;

        onAddItem(itemDraft);

        setItemDraft({
            typeServices: "",
            large: "",
            width: "",
            height: "",
            weight: ""
        });

        setErrors({});
    };

    return (
        <div>
            <label className="text-sm text-slate-500">Tipo servicio</label>

            <select
                value={ itemDraft.typeServices }
                onChange={(e) => handleChange("typeServices", e.target.value)}
                className={`
                    w-full 
                    mt-1 
                    px-4 
                    py-3 
                    rounded-lg 
                    bg-white/70 
                    border 
                    focus:outline-none 
                    focus:ring-2 
                    ${ errors['typeServices']?.state 
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-200 focus:ring-indigo-400"
                    }
                `}
            >
                <option value="">Selecciona una opción</option>
                <option value="pallet">Pallet</option>
                <option value="parcel">Paqueteria</option>
            </select>

            { errors.typeServices && (
                <p className="text-red-500 text-xs">
                    { errors.typeServices }
                </p>
            )}

            <label className="text-sm text-slate-500">Dimensiones (cm) y Peso (Kg)</label>

            <div className="flex gap-2 mt-2">
                { ["large", "width", "height", "weight"].map((field) => (
                    <div key={ field }>
                        <input 
                            value={ itemDraft[field] }
                            onChange={(e) => handleChange(field, e.target.value)}
                            placeholder={ field.charAt(0).toUpperCase() + field.slice(1) }
                            className={`
                                w-full 
                                px-3 
                                py-3 
                                rounded-lg 
                                bg-white/70 
                                border  
                                focus:outline-none 
                                focus:ring-2 
                                focus:ring-indigo-400
                                ${ errors[field] 
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-gray-200 focus:ring-indigo-400"
                                }
                            `} 
                        />

                        { errors[field] && (
                            <p  className="text-red-500 text-xs">
                                { errors[field] }
                            </p>
                        )}
                    </div>
                ))}
            </div>
        
            <button
                type="button"
                onClick={ handleAddItem }
                className="
                    py-3 
                    text-indigo-500 
                    text-sm 
                    font-medium
                    cursor-pointer
                    hover:text-shadow-2xs 
                "    
            >
                Añadir
            </button>
        </div>
    );
}

export default ItemDraftForm;