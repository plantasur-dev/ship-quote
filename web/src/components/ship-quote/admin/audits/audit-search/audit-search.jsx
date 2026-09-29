
import { useEffect, useState } from "react";
import { EmptyState, ErrorState, InputFinder } from "../../../../ui";
import { useAuditFilters, useAudits, usePolling } from "../../../../../hooks";
import AuditList from "../audit-list/audit-list";
import { Inbox } from "lucide-react";


const options = {
    id: 'audit-search',
    placeholder: 'Buscar código postal',
    className: 'h-14 mb-6'
};

function AuditSearch() {

    const [search, setSearch] = useState('');

    const {
        filters,
        updateFilter,
    } = useAuditFilters({ limit: 40, action: 'TARIFF_SEARCH' });

    const { activities, isLoading, refetch, error } = useAudits({ typeList: true, filters });
    
    useEffect(() => {
        const timerOut = setTimeout(() => {
            updateFilter('postalCode', search || undefined);
        }, 500);

        return () => clearTimeout(timerOut);
    }, [search, updateFilter]);

    usePolling(refetch, 60 * 5000);

    if (error !== null) {
        return <ErrorState variant={ error.status } />;
    }

    const { hasRecords, isFiltered } = activities?.meta ?? {};

    const hasResults = activities?.data?.length > 0;

    const showNoResults =
        !isLoading &&
        isFiltered &&
        hasRecords &&
        !hasResults;
    
    return (
        <div>
            <InputFinder 
                value={ search }
                options={ options }
                onChange={ setSearch }
            />

            { showNoResults ? (
                <EmptyState
                    icon={ Inbox } 
                    description={ `No se encontraron resultados para ${ search }` }
                />
            ) : (
                <AuditList 
                    activities={ activities }
                    isLoading={ isLoading } 
                />
            )}
        </div>
    );
}

export default AuditSearch;