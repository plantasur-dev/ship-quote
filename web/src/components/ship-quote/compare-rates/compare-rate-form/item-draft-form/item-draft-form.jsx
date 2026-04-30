import { useFormContext, useWatch } from "react-hook-form";

function ItemDraftForm({ onAddItem }) {

    const { register, control } = useFormContext();

    const watchDraft = useWatch({ control, name: "itemDraft" });

    return (
        <div>
            <label className="text-sm text-slate-500">Tipo servicio</label>

            <select
                { ...register('itemDraft.typeServices') }
                className={`
                    w-full 
                    mt-1 
                    px-4 
                    py-3 
                    rounded-lg 
                    bg-white/70 
                    border 
                    border-gray-200 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-indigo-400
                `}
            >
                <option value="">Selecciona una opción</option>
                <option value="pallet">Pallet</option>
                <option value="parcel">Paqueteria</option>
            </select>

            <label className="text-sm text-slate-500">Dimensiones (cm) y Peso (Kg)</label>

            <div className="flex gap-2 mt-2">
                <input 
                    {...register("itemDraft.large")} 
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
                    `} 
                />
                <input 
                    {...register("itemDraft.width")} 
                    placeholder="Ancho" 
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
                    `} 
                />
                <input 
                    {...register("itemDraft.height")} 
                    placeholder="Alto" 
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
                    `}   
                />
                <input 
                    {...register("itemDraft.weight")} 
                    placeholder="Peso" 
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
                    `}   
                />
            </div>
        
            <button
                type="button"
                onClick={ onAddItem }
                disabled={
                    !watchDraft.typeServices ||
                    !watchDraft.large ||
                    !watchDraft.width ||
                    !watchDraft.height ||
                    !watchDraft.weight
                }
                className="py-3 text-indigo-400 text-sm font-medium cursor-pointer"
            >
                Añadir
            </button>
        </div>
    );
}

export default ItemDraftForm;