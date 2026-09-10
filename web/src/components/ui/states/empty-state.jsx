
function EmptyState({ icon, sizeIcon = 23, description }) {

    const Icon = icon;

    return (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-accent">
            <Icon size={ sizeIcon }/>
            <span className="text-sm"> { description } </span>
        </div>
    );
}

export default EmptyState;