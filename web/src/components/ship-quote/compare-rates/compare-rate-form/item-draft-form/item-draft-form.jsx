
import { useState } from "react";

import {
    inputStyle,
    servicesLabel,
    dimensionsLabel
 } from './item-draft-form-styles';

function ItemDraftForm({ onAddItem }) {

    const [itemDraft, setItemDraft] = useState({
        typeServices: "",
        large: "",
        width: "",
        height: "",
        weight: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {

        setErrors((prev) => ({
            ...prev,
            [field]: undefined
        }));

        setItemDraft((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const validate = () => {

        const newErrors = {};

        const isInvalidNumber = (value) => {
            const n = Number(value);
            return isNaN(n) || n <= 0;
        };

        if (!itemDraft.typeServices) {
            newErrors.typeServices = 'Selecciona un tipo';
        }

        if (isInvalidNumber(itemDraft.large)) {
            newErrors.large = 'Requerido';
        }

        if (isInvalidNumber(itemDraft.width)) {
            newErrors.width = 'Requerido';
        }

        if (isInvalidNumber(itemDraft.height)) {
            newErrors.height = 'Requerido';
        }

        if (isInvalidNumber(itemDraft.weight)) {
            newErrors.weight = 'Requerido';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleAddItem = () => {

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
        <div
            className="
                rounded-3xl
                border
                border-slate-200/80
                bg-gradient-to-b
                from-white
                to-slate-50/70
                p-6
                shadow-sm
            "
        >
            <div className="mb-6">
                <h3 className="text-base font-semibold text-slate-900">
                    Añadir paquete
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Introduce dimensiones y peso del envío.
                </p>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">
                        Tipo de servicio
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        { servicesLabel.map((service) => {

                            const active =
                                itemDraft.typeServices === service.value;

                            return (
                                <button
                                    key={ service.value }
                                    type="button"
                                    onClick={() =>
                                        handleChange(
                                            'typeServices',
                                            service.value
                                        )
                                    }
                                    className={`
                                        rounded-2xl
                                        border
                                        p-4
                                        text-left
                                        transition-all
                                        duration-200
                                        cursor-pointer
                                        ${
                                            active
                                                ? `
                                                    border-indigo-500
                                                    bg-indigo-50
                                                    shadow-sm
                                                `
                                                : `
                                                    border-slate-200
                                                    bg-white
                                                    hover:border-slate-300
                                                    hover:bg-slate-50
                                                `
                                        }
                                    `}
                                >
                                    <div className="text-xl">
                                        { service.icon }
                                    </div>

                                    <div className="mt-3 text-sm font-medium text-slate-900">
                                        { service.label }
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    { errors.typeServices && (
                        <p className="text-sm text-red-500">
                            { errors.typeServices }
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">
                        Dimensiones y peso
                    </label>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        { dimensionsLabel.map((item) => (
                            <div
                                key={ item.field }
                                className="space-y-2"
                            >
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    { item.label }
                                </label>

                                <div className="relative">
                                    <input
                                        value={ itemDraft[item.field] }
                                        onChange={(e) =>
                                            handleChange(
                                                item.field,
                                                e.target.value
                                            )
                                        }
                                        placeholder="0"
                                        className={`
                                            ${ inputStyle }
                                            ${
                                                errors[item.field]
                                                    ? `
                                                        border-red-300
                                                        focus:border-red-400
                                                        focus:ring-red-400/10
                                                    `
                                                    : `
                                                        border-slate-200
                                                    `
                                            }
                                        `}
                                    />

                                    <span
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-xs
                                            font-medium
                                            text-slate-400
                                        "
                                    >
                                        { item.unit }
                                    </span>
                                </div>

                                { errors[item.field] && (
                                    <p className="text-xs text-red-500">
                                        { errors[item.field] }
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={ handleAddItem }
                        className="
                            inline-flex
                            h-11
                            items-center
                            justify-center
                            rounded-2xl

                            bg-gradient-to-r
                            from-slate-900
                            to-slate-800

                            px-5

                            text-sm
                            font-medium
                            text-white

                            shadow-lg
                            shadow-slate-900/10

                            transition-all
                            duration-200

                            hover:-translate-y-0.5
                            hover:shadow-xl

                            active:scale-[0.98]

                            cursor-pointer
                        "
                    >
                        + Añadir paquete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemDraftForm;