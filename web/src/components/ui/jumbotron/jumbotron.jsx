
import { useEffect, useState } from "react";
import { useLiveClock, formatClock } from "../../../utils";
import { ChevronRight } from "lucide-react";

export default function Jumbotron({ icon: Icon, crumbs = [], title, description, actions }) {
    const now = useLiveClock();

    return (
        <div className="relative overflow-hidden rounded-2xl border border-panel-border bg-panel px-7 py-6">
            <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
                preserveAspectRatio="none"
                viewBox="0 0 400 120"
                aria-hidden="true"
            >
                <path
                    d="M -20 100 C 80 100, 100 20, 200 20 S 340 90, 430 30"
                    fill="none"
                    className="stroke-panel-border"
                    strokeWidth="1"
                />
            </svg>

            <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div>
                    <nav
                        className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted"
                        aria-label="Ruta de navegación"
                    >
                        {crumbs.map((crumb, i) => (
                            <span key={ crumb } className="flex items-center gap-1.5">
                                {i > 0 && <ChevronRight size={ 11 } className="text-panel-border" />}
                                <span className={i === crumbs.length - 1 ? "text-accent" : ""}>
                                    { crumb }
                                </span>
                            </span>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        { Icon && (
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-panel-border bg-input-bg text-accent">
                                <Icon size={ 18 } />
                            </div>
                        )}
                        <h1 className="font-display text-2xl font-semibold text-text-primary">
                            {title}
                        </h1>
                    </div>

                    { description && (
                        <p className="mt-1.5 max-w-xl text-sm text-text-muted">{ description }</p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    { actions }
                    <div className="hidden items-center gap-2 rounded-lg border border-panel-border bg-input-bg px-3 py-1.5 font-mono text-[11px] text-text-muted sm:flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        { formatClock( now )}
                    </div>
                </div>
            </div>
        </div>
    );
}