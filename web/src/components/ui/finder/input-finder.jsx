
import { Search } from "lucide-react";

function InputFinder({ onChange }) {

    const handleChange = (event) => {
        const { value } = event.target;
        onChange(value);
    };

    return (
        <div className="flex w-full max-w-xs items-center overflow-hidden rounded-lg border border-panel-border bg-white transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Search className="ml-3 h-4 w-4 shrink-0 text-gray-400" />

            <input
                type="text"
                placeholder="Buscar..."
                className="w-full border-0 bg-transparent px-3 py-2 text-sm text-text-primary outline-none placeholder:text-gray-400 focus:ring-0"
                onChange={ handleChange }
            />
        </div>
    );
}

export default InputFinder;