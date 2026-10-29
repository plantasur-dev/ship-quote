
export const inputStyle = `
    flex 
    items-center 
    gap-3
    h-12
    w-full
    rounded-2xl
    border
    bg-white
    px-4
    pr-12
    font-medium
    text-sm
    text-slate-600
    shadow-sm
    outline-none
    transition-all
    duration-200

    placeholder:font-normal
    placeholder:text-slate-400

    focus-within:ring-offset-1

    focus:ring-offset-1
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