
import { ArrowLeft, PackageSearch, Van } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

function BrokenRouteBackdrop() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 700"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
        >
            <path
                d="M 60 560 C 260 560, 300 200, 500 200"
                fill="none"
                className="stroke-panel-border"
                strokeWidth="1.5"
            />
            <path
                d="M 60 560 C 260 560, 300 200, 500 200"
                fill="none"
                className="route-dash stroke-accent"
                strokeWidth="1.5"
                strokeDasharray="2 10"
                strokeLinecap="round"
                opacity="0.55"
            />

            {/* tramo cortado tras el nodo de origen */}
            <path
                d="M 520 210 C 620 260, 780 120, 940 140"
                fill="none"
                className="stroke-panel-border"
                strokeWidth="1.5"
                strokeDasharray="1 8"
                opacity="0.4"
            />

            <circle cx="60" cy="560" r="4.5" className="fill-accent" />
            <circle cx="60" cy="560" r="9" fill="none" className="stroke-accent" strokeWidth="1" opacity="0.4" />

            {/* nodo de destino roto — donde la ruta debería continuar */}
            <circle cx="500" cy="200" r="5" fill="none" className="stroke-danger" strokeWidth="1.5" />
            <path d="M 496 196 L 504 204 M 504 196 L 496 204" className="stroke-danger" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function NotFoundPage() {

    const verify = useAuth();

    const { isAuthLoading, user } = verify;

    const navigate = useNavigate();

    if (isAuthLoading) return;

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-canvas px-4">
            <style>{`
                @keyframes routeFlow {
                    to { stroke-dashoffset: -120; }
                }
                .route-dash {
                    stroke-dashoffset: 0;
                    animation: routeFlow 6s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .route-dash { animation: none; }
                }
            `}</style>

            <BrokenRouteBackdrop />

            <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
                <div className="mb-6 flex items-center gap-2 rounded-full border border-danger bg-danger-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-danger">
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    Ruta no encontrada
                </div>

                <div className="flex items-center gap-4">
                    <span className="font-display text-7xl font-semibold text-text-primary">4</span>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-border bg-panel text-accent">
                        <PackageSearch size={ 28 } />
                    </div>
                    <span className="font-display text-7xl font-semibold text-text-primary">4</span>
                </div>

                <h1 className="mt-6 font-display text-xl font-semibold text-text-primary">
                    Envío no localizado
                </h1>
                <p className="mt-2 max-w-sm text-sm text-text-muted">
                    La página que buscas no existe, se movió de zona o la URL tiene un error.
                    Comprueba la dirección o vuelve al panel.
                </p>

                <p className="mt-4 font-mono text-[11px] tracking-wider text-text-muted">
                    REF · 00-NF-404
                </p>

                <div className="mt-8 flex items-center gap-3">
                    { user ? 
                        <>
                            <button
                                onClick={ () => navigate(-1) }
                                className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-canvas transition-opacity hover:opacity-90 cursor-pointer"
                            >
                                <ArrowLeft size={ 15 } />
                                Volver al atrás
                            </button>

                            <Link
                                to='/admin'
                                className="rounded-xl border border-panel-border px-4 py-2.5 text-sm text-text-muted transition-colors hover:border-accent hover:text-accent"
                            >
                                Ir al dashboard
                            </Link>
                        </>
                    :
                        <Link
                            to='/'
                            className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-canvas transition-opacity hover:opacity-90 cursor-pointer"
                        >
                            <Van size={ 18 } />
                            Ir al comparador
                        </Link>
                    }   
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;