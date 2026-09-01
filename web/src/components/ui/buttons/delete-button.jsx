
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function DeleteButton({ onDelete }) {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleClick = () => {
        if (isConfirming) {
            onDelete();
            setIsConfirming(false);
        } else {
            setIsConfirming(true);
        }
    };

    return (
        <button
            type='button'
            onClick={ handleClick }
            onMouseLeave={ () => setIsConfirming(false) }
            className={`
                flex 
                cursor-pointer 
                items-center 
                gap-2 
                rounded-xl 
                border 
                px-4 
                py-2
                text-sm 
                font-medium 
                transition-all 
                duration-200 
                focus:outline-none
                ${ isConfirming
                    ? 'animate-pulse border-danger bg-danger text-white'
                    : 'border-panel-border text-text-muted hover:border-danger hover:text-danger'
                }
            `}
        >
            <Trash2 className="w-4 h-4" />
            <span>{ isConfirming ? '¿Estás seguro?' : 'Eliminar' }</span>
        </button>
    );
}