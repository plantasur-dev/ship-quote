
function IncidentList({ incidents = [] }) {
    if (!incidents.length) return null;

    return (
        <div className="space-y-2">
            {incidents.map((incident, i) => (
                <div
                    key={i}
                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700"
                >
                    <p className="font-medium">{incident.type}</p>

                    {incident.message && (
                        <p className="mt-1 text-sm">{incident.message}</p>
                    )}

                    {incident.typeServices && (
                        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                <span>Tipo: {incident.typeServices}</span>
                                <span>Peso: {incident.weight} kg</span>
                                <span>Largo: {incident.large}</span>
                                <span>Ancho: {incident.width}</span>
                                <span>Alto: {incident.height}</span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default IncidentList;