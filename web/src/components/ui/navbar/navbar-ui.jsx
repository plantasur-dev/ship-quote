
import rateIcon from '../../../assets/img/icons/rate-icon.png';

function Navbar() {
    return (
        <header
            className="
                border-b
                border-slate-200/80
                bg-white/70
                backdrop-blur-xl
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    h-16
                    max-w-7xl
                    items-center
                    justify-between
                    px-6
                "
            >
                <div className="flex items-center gap-3">
                    <img
                        src={ rateIcon }
                        alt="Cotizador"
                        width={ 40 }
                        height={ 4 }
                        className="shrink-0"
                    />

                    <div className="flex flex-col">
                        <span className="text-sm font-semibold leading-tight text-slate-900">
                            RateHub
                        </span>

                        <span className="text-xs leading-tight text-slate-500">
                            Comparador interno de tarifas
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;