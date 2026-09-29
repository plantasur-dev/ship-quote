
import { Search, X } from "lucide-react";

function InputFinder({ onChange, value, options = {} }) {

    const handleChange = (event) => {
        const { value } = event.target;
        onChange(value);
    };

    const handleInputClear = () => {
        onChange('');
    };

    return (
        <div
            className={`
                flex 
                w-full
                items-center 
                overflow-hidden 
                rounded-xl 
                border
                border-panel-border 
                bg-panel 
                transition-colors
                focus-within:border-accent 
                focus-within:ring-1 
                focus-within:ring-accent
                ${ options.className ?? '' }
            `}
        >
            <Search 
                size={ 14 }
                className="ml-3.5 shrink-0 text-text-muted" 
            />
 
            <input
                type="text"
                className="
                    w-full
                    border-0
                    bg-transparent
                    px-3
                    py-2.5
                    text-sm
                    text-text-primary
                    outline-none
                    placeholder:text-text-muted
                    focus:ring-0
                "
                value={ value || "" }
                id={ `name-${ options.id }-finder` }
                placeholder={ options.placeholder || "Buscar..." }
                onChange={ (e) => handleChange(e) }
            />
             
            <button
                type="button"
                onClick={ () => handleInputClear() }
                aria-label="Limpiar búsqueda"
                className={`
                    mr-3.5 
                    shrink-0 
                    text-text-muted 
                    transition-colors 
                    ${ value ? 'opacity-100 cursor-pointer' : 'pointer-events-none opacity-0' }
                `}
            >
                <X size={ 18 } />
            </button>
        </div>
    );
}

export default InputFinder;