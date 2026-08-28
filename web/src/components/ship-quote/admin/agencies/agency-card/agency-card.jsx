
import { Globe2, MapPin } from "lucide-react";
import { Link } from 'react-router-dom';
import ActiveToggle from "./agency-toggle/agency-toggle";
import FuelSurchargeField from "./agency-fuel-surcharge/agency-fuel-surcharge";

const TYPE_LABEL = { api: "API", static: "Estática", hybrid: "Híbrida" };

function AgencyCard({ agency, onToggleActive, onUpdateFuel }) {
    
    return (
        <div
            className={`rounded-2xl border bg-panel p-5 transition-opacity
                ${ agency.active ? 'border-panel-border' : 'border-panel-border opacity-60' }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Link to={`/admin/agencies/${ agency.id }/update`} >
                        <div className="
                            flex 
                            h-10 
                            w-10 
                            items-center 
                            justify-center 
                            rounded-xl 
                            border 
                            border-panel-border 
                            hover:border-accent
                            bg-input-bg
                            hover:bg-info-soft
                            font-display 
                            text-sm 
                            font-semibold 
                            text-accent
                        ">
                            { agency?.name?.slice(0, 2).toUpperCase() }
                        </div>
                    </Link>
                    <div>
                        <p className="font-display text-sm font-semibold text-text-primary">
                            { agency.name }
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                            <span className="rounded-full bg-input-bg px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                                { TYPE_LABEL[agency.type] }
                            </span>
                            <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                                { agency?.rules?.coverage.includes("international") ? (
                                    <Globe2 size={ 10 } />
                                ) : (
                                    <MapPin size={ 10 } />
                                )}
                               
                                { agency?.rules?.coverage.join(', ') }
                            </span>
                        </div>
                    </div>
                </div>

                <ActiveToggle 
                    agency={ agency } 
                    onToggle={ onToggleActive }  
                />
            </div>

            <div className="mt-5 border-t border-panel-border pt-4">
                <FuelSurchargeField
                    agency={ agency }
                    onUpdateFuel={ onUpdateFuel }
                />
            </div>
        </div>
    );
}

export default AgencyCard;