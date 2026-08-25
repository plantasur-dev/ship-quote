
import { LogOut } from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import { NAV_ITEMS } from "../../../utils"; 

import { useAuth } from '../../../contexts/auth-context';

function Siderbar() {

    const { user, logout } = useAuth();

    const location = useLocation();

    return (
        <aside className="hidden w-60 shrink-0 flex-col border-r border-panel-border bg-panel px-4 py-6 lg:flex">
            <div className="mb-8 flex items-center gap-2.5 px-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-panel-border bg-input-bg text-sm font-semibold text-accent">
                    SQ
                </div>
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                        Ship-Quote
                    </p>
                    <p className="font-display text-sm font-medium text-text-primary">
                        Consola interna
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                { NAV_ITEMS.map(({ label, icon: Icon, to }) => (
                    <Link
                        to={ to }
                        key={ label }
                        className={[
                            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors cursor-pointer",
                            ( to === location.pathname )
                                ? "bg-accent-soft text-accent"
                                : "text-text-muted hover:bg-input-bg hover:text-text-primary",
                        ].join(" ")}
                    >
                        <Icon size={ 16 } />
                        { label }
                    </Link>
                ))}
            </nav>

            <div className="mt-6 flex items-center justify-between rounded-lg border border-panel-border px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-input-bg font-mono text-[11px] text-text-primary">
                        { user.username.slice(0, 2).toUpperCase() }
                    </div>
                    <div className="leading-tight">
                        <p className="text-xs text-text-primary">{ user.username[0] + user.username.slice(1).toLowerCase() }</p>
                        <p className="font-mono text-[10px] text-text-muted">{ user.email }</p>
                    </div>
                </div>
                <button 
                    aria-label="Cerrar sesión" 
                    className="text-text-muted hover:text-danger cursor-pointer"
                    onClick={ () => logout() }
                >
                    <LogOut size={ 15 } />
                </button>
            </div>
        </aside>
    );
}

export default Siderbar;