
import {
    Boxes,
    ReceiptText
} from 'lucide-react';

import Breakdown from './breakdown';

function ServiceBreakdown({ item }) {

    return (
        <>
            { item.breakdown?.length > 0 && (
                <div>
                    <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`
                                        flex h-12 w-12 items-center justify-center rounded-2xl
                                        bg-gradient-to-br from-indigo-500 to-cyan-500
                                        text-white shadow-lg shadow-indigo-200
                                        transition-transform duration-300
                                        group-hover:scale-105
                                    `}
                                >
                                    <Boxes size={ 22 } />
                                </div>

                                <div>
                                    <p className="text-lg font-semibold text-slate-900">
                                        { item.service[0].toUpperCase() + item.service.slice(1) }
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        { item.itemCount } bultos
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wide text-slate-400">
                                    Total Servicio
                                </p>

                                <p className="text-3xl font-black tracking-tight text-slate-900">
                                    { Number(item.total || 0).toFixed(2) }
                                    <span className="ml-1 text-lg font-semibold text-slate-500">
                                        €
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 space-y-5">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <ReceiptText
                                    size={ 16 }
                                    className="text-slate-400"
                                />

                                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Desglose bultos
                                </h4>
                            </div>

                            <Breakdown breakdowns={ item.breakdown } />
                            
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ServiceBreakdown;