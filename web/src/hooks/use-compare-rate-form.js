
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

export function useCompareRateForm () {

    const [serverErrors, setErrorsServer] = useState({});

    const form = useForm({
        mode: 'onSubmit',
        defaultValues: {
            countryCode: "ES",
            destinationPostalCode: "",
            province: "",
            items: [],
            itemDraft: {
                typeServices: "",
                large: "",
                width: "",
                height: "",
                weight: ""
            }
        }
    });

    const {
        control,
        setValue,
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    }); 
    
    const watchDraft = useWatch({ control, name: 'itemDraft' });

    const addItem = () => {
        
        if (
            !watchDraft.large ||
            !watchDraft.width ||
            !watchDraft.height ||
            !watchDraft.weight ||
            !watchDraft.typeServices
        ) return;

        append(watchDraft);

        setValue('itemDraft', {
            typeServices: "",
            large: "",
            width: "",
            height: "",
            weight: ""
        });
    };

    const removeItem = (index) => remove(index);

    return {
        ...form,

        serverErrors,
        setErrorsServer,

        items: fields,
        addItem,
        removeItem
    };
}; 