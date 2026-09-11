
import { useEffect, useState } from "react";

import { STATUS_MESSAGES } from "../../../utils";

export function RouteSpinner({ size = 40, trackColor = 'stroke-panel-border' }) {
    const stroke = Math.max(2, size * 0.07);
    const r = (size - stroke) / 2;
    const c = size / 2;
    const circumference = 2 * Math.PI * r;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${ size } ${ size }`}
            className="route-spinner"
            role="status"
            aria-label="Cargando"
        >
            <circle
                cx={c}
                cy={c}
                r={r}
                fill="none"
                className={`${ trackColor }`}
                stroke={ trackColor }
                strokeWidth={ stroke }
                strokeDasharray="1 7"
                strokeLinecap="round"
            />
            <circle
                cx={c}
                cy={c}
                r={r}
                fill="none"
                strokeWidth={ stroke }
                strokeLinecap="round"
                strokeDasharray={ `${ circumference * 0.22 } ${ circumference }` }
                className="stroke-accent route-spinner-arc"
            />
            <style>{`
                .route-spinner-arc {
                    transform-origin: center;
                    animation: routeSpin 1.1s linear infinite;
                }
                @keyframes routeSpin {
                    to { transform: rotate(360deg); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .route-spinner-arc { animation-duration: 2.6s; }
                }
            `}</style>
        </svg>
    );
}

export default function LoadingScreen({ label }) {
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        if (label) return;
        
        const id = setInterval(() => {
            setMsgIndex((i) => (i + 1) % STATUS_MESSAGES.length);
        }, 1800);

        return () => clearInterval(id);
    }, [label]);

    const message = label ?? STATUS_MESSAGES[msgIndex];

    return (
        <div
            className="flex min-h-screen w-full flex-col items-center justify-center gap-5 bg-canvas"
            role="status"
            aria-live="polite"
        >
            <div className="relative flex items-center justify-center">
                <RouteSpinner size={56} />
                <div
                    className="
                        absolute 
                        flex 
                        h-7 
                        w-7 
                        items-center 
                        justify-center 
                        rounded-md 
                        border 
                        border-panel-boder
                        text-accent
                        text-[10px] 
                        font-semibold
                        bg-panel
                    "
                >
                    SQ
                </div>
            </div>

            <p
                key={ message }
                className="fade-in text-[11px] uppercase tracking-[0.25em] text-text-muted font-mono"
            >
                { message }
                <span className="dots text-accent" />
            </p>

            <style>{`
                .fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(2px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .dots::after {
                    display: inline-block;
                    width: 1.2em;
                    text-align: left;
                    content: "";
                    animation: dotsCycle 1.4s steps(4, end) infinite;
                }
                @keyframes dotsCycle {
                    0%   { content: ""; }
                    25%  { content: "."; }
                    50%  { content: ".."; }
                    75%  { content: "..."; }
                    100% { content: ""; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .fade-in { animation: none; }
                    .dots::after { animation: none; content: "..."; }
                }
            `}</style>
        </div>
    );
}