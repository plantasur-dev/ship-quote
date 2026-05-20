
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
                <div>
                    <h1 className="text-sm font-semibold text-slate-900">
                        Cotizador de envíos
                    </h1>

                    <p className="text-xs text-slate-500">
                        Comparador interno de tarifas
                    </p>
                </div>
            </div>
        </header>
    );
}

export default Navbar;