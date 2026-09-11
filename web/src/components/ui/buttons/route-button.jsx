
import { useNavigate } from "react-router-dom";

function RouteButton({ title = 'New button', to = '/admin', size = 14, icon }) {

    const navigate = useNavigate();

    const Icon = icon;

    return (
        <button 
            onClick={ () => navigate(to)}
            className='
                flex 
                items-center 
                gap-1.5 
                rounded-lg 
                bg-accent 
                px-3.5 
                py-2 
                font-mono 
                text-xs 
                font-semibold 
                uppercase 
                tracking-wider 
                text-canvas 
                transition-opacity 
                hover:opacity-90 
                cursor-pointer
            '>
                <Icon size={ size } />
                { title }
        </button>);
}

export default RouteButton;