
import { Package } from "lucide-react";

function ItemCard({ item }) {
    const { typeServices, large, width, height, weight } = item;
 
    return (
        <div className="flex items-center gap-3 rounded-lg border border-panel-border px-3 py-2">
            <Package className="h-4 w-4 shrink-0 text-text-muted" />
            <div className="flex flex-col">
                <span className="text-[13px] font-medium capitalize text-text-primary">
                    { typeServices ?? 'Bulto' }
                </span>
                <span className="font-mono text-[14px] text-text-muted">
                    Largo <span className="text-accent">{ large }</span> × 
                    Ancho <span className="text-accent">{ width }</span> × 
                    Alto <span className="text-accent">{ height }</span> cm 
                    · <span className="text-accent">{ weight }</span> kg
                </span>
            </div>
        </div>
    );
}

export default ItemCard;