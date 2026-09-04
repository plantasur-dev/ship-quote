

import { RouteBackdrop } from "../../../components/ui";

import { LoginForm } from "../../../components/auth";

export default function LoginPage() {

    return (
        <div className="bg-canvas relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 route-dash field-input:focus">
            
            <RouteBackdrop />

            <div className="relative z-10 w-full max-w-[400px]">
                <div className="mb-8 flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-panel-border bg-panel text-sm font-semibold text-accent">
                        SQ
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] font-mono text-text-muted">
                            ShipQuote
                        </p>
                        <p className="text-sm font-medium font-display text-text-primary">
                            Administrador
                        </p>
                    </div>
                </div>
                
                <div className="relative rounded-2xl border border-panel-border bg-panel p-8 shadow-2xl">
                    <h1 className="text-xl font-semibold text-text-primary font-display">
                        Iniciar sesión
                    </h1>

                    <LoginForm />
                </div>

                <p className="mt-6 text-center text-xs text-text-muted font-mono">
                    v2.0.0 · ShipQuote
                </p>
            </div>
        </div>
    );
}