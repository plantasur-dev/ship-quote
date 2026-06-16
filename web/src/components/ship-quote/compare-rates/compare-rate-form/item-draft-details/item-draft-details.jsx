
import ItemDetails from "./item-details";

function ItemDraftDetails({ items, onRemove }) {

    if (!items?.length) {

        return (
            <div
                className="
                    rounded-3xl
                    border
                    border-dashed
                    border-slate-200
                    bg-slate-50/60
                    py-10
                    text-center
                "
            >
                <div className="text-3xl">
                    📭
                </div>

                <p className="mt-3 text-sm font-medium text-slate-600">
                    No hay bultos añadidos
                </p>

                <p className="mt-1 text-sm text-slate-400">
                    Añade un paquete para calcular tarifas.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">
                    Bultos añadidos
                </h3>

                <span
                    className="
                        rounded-full
                        bg-slate-100
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-slate-500
                    "
                >
                    { items.length }
                </span>
            </div>

            <div className="space-y-4">
                
                { items.map((item, index) => (
                    <ItemDetails 
                        key={ index }
                        item={ item }
                        index={ index }
                        onRemove={ onRemove }
                    />
                ))}

            </div>
        </div>
    );
}

export default ItemDraftDetails;