
import { useCallback, useState } from "react";

const INITIAL_FILTERS = {};

export function useAuditFilters(initialFilters = INITIAL_FILTERS) {
    const [filters, setFilters] = useState(initialFilters);

    const updateFilter = useCallback((name, value) => {
        setFilters((currentFilters) => ({
            ...currentFilters,
            [name]: value,
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    return {
        filters,
        updateFilter,
        resetFilters,
    };
}