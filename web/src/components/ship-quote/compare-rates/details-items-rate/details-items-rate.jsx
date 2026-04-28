
function DetailsItemsRate({ items, onRemove }) {

    if (!items?.length) {
       return (
            <div className="text-sm text-slate-400 mt-4 text-center py-6 border border-dashed rounded-xl bg-white/40">
                No hay pallets añadidos todavía
            </div>
        );
    }
        
    return (
        <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-slate-600">
                Pallets añadidos ({items.length})
            </h3>

            <div className="space-y-3">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition"
                    >
                        <div className="p-4 flex items-center justify-between gap-4">

                            <div className="grid grid-cols-4 gap-4 w-full text-sm">
                                <div>
                                    <p className="text-slate-400 text-xs">Largo</p>
                                    <p className="font-medium text-slate-700">{item.large} cm</p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-xs">Ancho</p>
                                    <p className="font-medium text-slate-700">{item.width} cm</p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-xs">Alto</p>
                                    <p className="font-medium text-slate-700">{item.height} cm</p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-xs">Peso</p>
                                    <p className="font-medium text-slate-700">{item.weight} kg</p>
                                </div>
                            </div>

                            <button
                                onClick={() => onRemove(item)}
                                className="
                                    opacity-0 
                                    group-hover:opacity-100 
                                    transition 
                                    text-xs 
                                    font-medium 
                                    text-red-500 
                                    hover:text-red-700
                                    cursor-pointer
                                "
                            >
                                Eliminar
                            </button>
                        </div>

                        <div className="h-1 w-full bg-gradient-to-r from-indigo-500/30 via-indigo-500/10 to-transparent" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DetailsItemsRate;