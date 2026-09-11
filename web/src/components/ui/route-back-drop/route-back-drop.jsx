
function RouteBackdrop() {

    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 700"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
        >
            <path
                d="M 60 560 C 260 560, 300 200, 520 200 S 820 420, 940 120"
                fill="none"
                stroke="var(--color-panel-border)"
                strokeWidth="1.5"
            />
            <path
                d="M 60 560 C 260 560, 300 200, 520 200 S 820 420, 940 120"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeDasharray="2 10"
                strokeLinecap="round"
                className="route-dash"
                opacity="0.55"
            />
            <circle cx="60" cy="560" r="4.5" fill="var(--color-accent)" />
            <circle cx="60" cy="560" r="9" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.4" />
            <circle cx="940" cy="120" r="4.5" fill="var(--color-accent)" />
            <circle cx="940" cy="120" r="9" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.4" />
        </svg>
    );
}

export default RouteBackdrop;