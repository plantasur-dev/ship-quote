
const typeStyles = {
  parcel: {
    container: "rounded-xl bg-teal-50 border border-teal-200",
    accent: "text-teal-600"
  },
  pallet: {
    container: "rounded-xl bg-sky-50 border border-sky-200",
    accent: "text-sky-600"
  }
}

function CompareRateItemsDetails({ items, onRemove }) {
    
    if (!items?.length) {
       return (
            <div className="text-sm text-slate-400 mt-4 text-center py-6 border border-dashed rounded-xl bg-white/40">
                No hay bultos añadidos todavía
            </div>
        );
    }
    
    return (
        <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-slate-600">
                Bultos añadidos ({ items.length })
            </h3>

            <div className="space-y-3">
                { items.map((item, index) => (
                    <div
                        key={ index }
                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition"
                    >
                        <div
                            className={`
                                relative
                                overflow-hidden
                                rounded-lg
                                p-4 flex items-center justify-between gap-4
                                ${ typeStyles[item.typeServices]?.container }
                            `}
                        >
                            <span className={`text-xs font-semibold whitespace-nowrap ${ typeStyles[item.typeServices]?.accent }`}>
                                { item.typeServices.charAt(0).toUpperCase() + item.typeServices.slice(1) } ({ index + 1 })
                            </span>
 
                            <div className="relative z-10 grid grid-cols-4 gap-2 w-full text-sm">
                                <div>
                                    <p className="text-slate-400 text-xs">Largo</p>
                                    <p className="font-medium text-slate-700">{ item.large } cm</p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-xs">Ancho</p>
                                    <p className="font-medium text-slate-700">{ item.width } cm</p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-xs">Alto</p>
                                    <p className="font-medium text-slate-700">{ item.height } cm</p>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-xs">Peso</p>
                                    <p className="font-medium text-slate-700">{ item.weight } kg</p>
                                </div>
                            </div>

                            <button
                                onClick={() => onRemove(index)}
                                className="
                                relative z-10
                                opacity-0 group-hover:opacity-100 transition
                                text-xs font-medium text-red-500 hover:text-red-700
                                cursor-pointer
                                "
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompareRateItemsDetails;