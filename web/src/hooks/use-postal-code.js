
import { useEffect } from "react";

export function usePostalCode ({ watchPostal, provinces, setValue }) {

    useEffect(() => {
        if (!watchPostal || provinces.length === 0) return;

        const postalPrefix = watchPostal.slice(0, 2);
        
        const filterPro = provinces.find(
            province => String(province?.postalCode) === postalPrefix
        );

        if (filterPro) {
            setValue('province', filterPro.adminFullCode);
        }

    }, [watchPostal, provinces, setValue]);
};