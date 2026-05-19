
function SkeletonForm() {
    return (
        <div className="space-y-6 animate-pulse">

            <div className="space-y-2">
                <div className="h-5 w-40 rounded-full bg-slate-200/70" />
                <div className="h-4 w-64 rounded-full bg-slate-200/60" />
            </div>

            <div className="
                rounded-3xl
                border
                border-slate-200/60
                bg-white/60
                p-6
                shadow-sm
                backdrop-blur-xl
                space-y-6
            ">

                <div className="space-y-2">
                    <div className="h-3 w-16 rounded-full bg-slate-200/60" />
                    <div className="h-12 w-full rounded-2xl bg-slate-200/50" />
                </div>

                <div className="space-y-2">
                    <div className="h-3 w-24 rounded-full bg-slate-200/60" />
                    <div className="h-12 w-full rounded-2xl bg-slate-200/50" />
                </div>

                <div className="space-y-2">
                    <div className="h-3 w-20 rounded-full bg-slate-200/60" />
                    <div className="h-12 w-full rounded-2xl bg-slate-200/40" />
                </div>

                <div className="space-y-3">
                    <div className="h-3 w-32 rounded-full bg-slate-200/60" />

                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-20 rounded-2xl bg-slate-200/40" />
                        <div className="h-20 rounded-2xl bg-slate-200/40" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="h-12 rounded-2xl bg-slate-200/40" />
                        <div className="h-12 rounded-2xl bg-slate-200/40" />
                        <div className="h-12 rounded-2xl bg-slate-200/40" />
                        <div className="h-12 rounded-2xl bg-slate-200/40" />
                    </div>
                </div>

                <div className="h-12 w-full rounded-2xl bg-slate-300/50" />
            </div>
        </div>
    );
}

export default SkeletonForm;