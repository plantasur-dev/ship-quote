
export const inputStyle = `
    h-12
    w-full
    rounded-2xl
    border
    bg-white
    px-4
    pr-12
    text-sm
    text-slate-900
    shadow-sm
    outline-none
    transition-all
    duration-200

    placeholder:text-slate-400

    hover:border-slate-300

    focus:border-indigo-500
    focus:ring-4
    focus:ring-indigo-500/10
`;

export const servicesLabel = [
    {
        value: 'pallet',
        label: 'Pallet',
        icon: '📦'
    },
    {
        value: 'parcel',
        label: 'Paquetería',
        icon: '🚚'
    }
];

export const dimensionsLabel = [
    {
        field: 'large',
        label: 'Largo',
        unit: 'cm'
    },
    {
        field: 'width',
        label: 'Ancho',
        unit: 'cm'
    },
    {
        field: 'height',
        label: 'Alto',
        unit: 'cm'
    },
    {
        field: 'weight',
        label: 'Peso',
        unit: 'kg'
    }
];