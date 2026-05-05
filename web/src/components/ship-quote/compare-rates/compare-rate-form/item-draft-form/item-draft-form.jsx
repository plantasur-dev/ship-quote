
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
        const newErrors = {};

        if (!itemDraft.typeServices) newErrors.typeServices = "Selecciona un tipo";
        if (!itemDraft.large) newErrors.large = true;
        if (!itemDraft.width) newErrors.width = true;
        if (!itemDraft.height) newErrors.height = true;
        if (!itemDraft.weight) newErrors.weight = true;

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
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
                    ${ errors.typeServices 
                        ? "border-red-200 focus:ring-red-400"
                        : "border-gray-200 focus:ring-indigo-400"
                    }
                `}
            >
                <option value="">Selecciona una opción</option>
                <option value="pallet">Pallet</option>
                <option value="parcel">Paqueteria</option>
            </select>

            { errors.typeServices && (
                <p className="text-red-500 text-sm">
                    { errors.typeServices }
                </p>
            )}

            <label className="text-sm text-slate-500">Dimensiones (cm) y Peso (Kg)</label>

            <div className="flex gap-2 mt-2">
                { ["large", "width", "height", "weight"].map((field) => (
                    <input 
                        key={ field }
                        value={ itemDraft[field] }
                        onChange={(e) => handleChange(field, e.target.value)}
                        placeholder="Largo" 
                        className={`
                            w-full 
                            px-3 
                            py-3 
                            rounded-lg 
                            bg-white/70 
                            border 
                            border-gray-200 
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-indigo-400
                            ${errors[field] 
                                ? "border-red-400 focus:ring-red-400"
                                : "border-gray-200 focus:ring-indigo-400"
                            }
                        `} 
                    />
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