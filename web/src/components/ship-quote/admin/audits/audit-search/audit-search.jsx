
import { SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState, ErrorState, InputFinder, Pagination } from "../../../../ui";
import AuditList from "../audit-list/audit-list";
import { useAuditFilters, useAudits, usePolling } from "../../../../../hooks";


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
    } = useAuditFilters({ page: 1, limit: 15, action: 'TARIFF_SEARCH' });

    const { 
        activities, 
        isLoading, 
        refetch, 
        error, 
        pagination,
    } = useAudits({ typeList: true, filters });

    usePolling(refetch, 60 * 8000);

    useEffect(() => {
        const timer = setTimeout(() => {
            updateFilter('postalCode', search || undefined);
        }, 500);

        return () => clearTimeout(timer);
    }, [search, updateFilter]);

    useEffect(() => {
        if (pagination?.totalPages === 1 && filters.page !== 1) {
            updateFilter('page', 1);
        }
    }, [
        pagination?.totalPages,
        filters.page,
        updateFilter,
    ]);

    const handlePageChange = (newPage) => updateFilter('page', newPage);

    const { hasRecords, isFiltered } = activities?.meta ?? {};

    const hasResults = activities?.data?.length > 0;

    const isSearchEmpty =
        !isLoading &&
        isFiltered &&
        hasRecords &&
        !hasResults;

    if (error !== null) {
        return <ErrorState variant={ error.status } />;
    }
    
    return (
        <div>
            { hasRecords && <InputFinder 
                value={ search }
                options={ options }
                onChange={ setSearch }
            /> }

            { isSearchEmpty ? (
                <EmptyState
                    icon={ SearchX } 
                    description={ `No se encontraron resultados para el código postal ${ search }` }
                />
            ) : (
                <AuditList 
                    activities={ activities }
                    isLoading={ isLoading } 
                />
            )}

            <Pagination
                pagination={ pagination }
                onPageChange={ handlePageChange } 
            />
        </div>
    );
}

export default AuditSearch;