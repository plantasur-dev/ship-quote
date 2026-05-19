
const typeStyles = {
    parcel: {
        container: `
            bg-teal-50
            text-teal-700
            ring-teal-100
        `,
        icon: "🚚",
        label: "Paquetería"
    },

    pallet: {
        container: `
            bg-sky-50
            text-sky-700
            ring-sky-100
        `,
        icon: "📦",
        label: "Pallet"
    }
};

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

                { items.map((item, index) => {

                    const currentType =
                        typeStyles[item.typeServices];

                    return (

                        <div
                            key={ index }

                            className="
                                group
                                rounded-3xl
                                border
                                border-slate-200/80
                                bg-white/80
                                p-5
                                shadow-sm
                                transition-all
                                duration-200

                                hover:-translate-y-0.5
                                hover:shadow-lg
                            "
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex items-center gap-3">

                                    <div
                                        className={`
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            text-xl
                                            ring-1
                                            ${ currentType.container }
                                        `}
                                    >
                                        { currentType.icon }
                                    </div>

                                    <div>

                                        <h4 className="text-sm font-semibold text-slate-900">
                                            { currentType.label }
                                        </h4>

                                        <p className="text-xs text-slate-400">
                                            Bulto #{ index + 1 }
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onRemove(index)}

                                    className="
                                        rounded-xl
                                        px-3
                                        py-2
                                        text-xs
                                        font-medium
                                        text-slate-400
                                        transition-colors

                                        hover:bg-red-50
                                        hover:text-red-500
                                    "
                                >
                                    Eliminar
                                </button>
                            </div>

                            <div
                                className="
                                    mt-5
                                    grid
                                    grid-cols-2
                                    gap-3
                                    md:grid-cols-4
                                "
                            >
                                {[
                                    {
                                        label: 'Largo',
                                        value: `${ item.large } cm`
                                    },
                                    {
                                        label: 'Ancho',
                                        value: `${ item.width } cm`
                                    },
                                    {
                                        label: 'Alto',
                                        value: `${ item.height } cm`
                                    },
                                    {
                                        label: 'Peso',
                                        value: `${ item.weight } kg`
                                    }
                                ].map((spec) => (

                                    <div
                                        key={ spec.label }

                                        className="
                                            rounded-2xl
                                            bg-slate-50
                                            p-3
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                            "
                                        >
                                            { spec.label }
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-semibold
                                                text-slate-800
                                            "
                                        >
                                            { spec.value }
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ItemDraftDetails;