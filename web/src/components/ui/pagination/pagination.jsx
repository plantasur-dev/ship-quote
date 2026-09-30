
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ pagination, onPageChange }) {

    if (!pagination || pagination?.totalPages <= 1) return;

    return (
        <div className="flex items-center justify-center gap-3 p-2">
            <button
                disabled={ !pagination.hasPrevPage }
                onClick={() => onPageChange(pagination.page - 1)}
                className="
                    flex items-center gap-1.5
                    rounded-lg border border-panel-border
                    px-3.5 py-2
                    text-sm font-medium text-text-muted
                    transition-colors
                    hover:enabled:text-text-primary
                    disabled:cursor-not-allowed disabled:opacity-40
                    cursor-pointer
                "
            >
                <ChevronLeft size={ 15 } />
                Anterior
            </button>

            <span className="text-sm text-text-muted">
                Página <span className="text-text-primary">{ pagination.page }</span> de{" "}
                <span className="text-text-primary">{ pagination.totalPages }</span>
            </span>

            <button
                disabled={ !pagination.hasNextPage }
                onClick={ () => onPageChange(pagination.page + 1) }
                className="
                    flex items-center gap-1.5
                    rounded-lg border border-panel-border
                    px-3.5 py-2
                    text-sm font-medium text-text-muted
                    transition-colors
                    hover:enabled:text-text-primary
                    disabled:cursor-not-allowed disabled:opacity-40
                    cursor-pointer
                "
            >
                Siguiente
                <ChevronRight size={ 15 } />
            </button>
        </div>
    );
};

export default Pagination;