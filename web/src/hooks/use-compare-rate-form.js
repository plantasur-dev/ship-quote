
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export function useCompareRateForm () {

    const [serverErrors, setErrorsServer] = useState({});

    const form = useForm({
        mode: 'onBlur',
        defaultValues: {
            countryCode: "ES",
            destinationPostalCode: "",
            province: "",
            items: []
        }
    });

    const {
        control,
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    }); 
    
    const addItem = (watchDraft) => {
        
        if (
            !watchDraft.large ||
            !watchDraft.width ||
            !watchDraft.height ||
            !watchDraft.weight ||
            !watchDraft.typeServices
        ) return;

        append(watchDraft);
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