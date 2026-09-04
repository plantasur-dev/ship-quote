
import { useEffect, useState } from "react";
import { getProvince } from "../services/api-service";


export function useProvince({ countryCode, codePostal }) {

        const [isLoading, setIsLoading] = useState(false);
        const [province, setProvince] = useState([]);
    
        useEffect(() => {
            const fetchProvinces = async () => {
                setIsLoading(true);
    
                try {
                    const province = await getProvince(countryCode, codePostal);
                    setProvince(province);
                } catch (error) {
                    const { errors } = error;
                    console.error(errors);
                } finally {
                    setIsLoading(false);
                }
            };    
    
            fetchProvinces();       
        }, [countryCode, codePostal]);
    
        return { isLoadingProvince: isLoading, province };
};