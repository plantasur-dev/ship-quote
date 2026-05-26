
import {
    X,
    AlertTriangle,
} from 'lucide-react';

import Incident from "./indicent";

function IncidentList({ item }) {

    return (
        <>
            { item.incidents?.length > 0 && (
                <div>
                    <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`
                                        flex h-12 w-12 items-center justify-center rounded-2xl
                                        bg-gradient-to-br from-red-400 to-red-300
                                        text-white shadow-lg shadow-red-200
                                        transition-transform duration-300
                                        group-hover:scale-105
                                    `}
                                >
                                    <X size={ 26 } />
                                </div>

                                <div>
                                    <p className="font-semibold text-slate-800">
                                        { item.service[0].toUpperCase() + item.service.slice(1) }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 space-y-5">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <AlertTriangle
                                    size={ 16 }
                                    className="text-amber-500"
                                />

                                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Incidencias
                                </h4>
                            </div>

                            <Incident incidents={ item.incidents } />
                            
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default IncidentList;