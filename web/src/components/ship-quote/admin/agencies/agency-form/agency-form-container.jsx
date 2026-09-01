
import { useParams } from "react-router-dom";
import LoadingScreen from "../../../../ui/loaders/loader";
import AgencyForm from "./agency-form";
import { useAgency, useAgenciesForm } from "../../../../../hooks";

function AgencyFormContainer({ mode }) {

    const { agencyId } = useParams();

    const { agency, isLoading: isLoadingAgency } = useAgency({ agencyId });

    const { onSubmit, onDelete, isLoadingDeleting } = useAgenciesForm({ mode, agencyId });

    if (isLoadingAgency) {
        return <LoadingScreen label={ `Cargando carrier...`}/>;
    }

    if (isLoadingDeleting) {
        return <LoadingScreen label={ `Eliminando carrier...`}/>;
    }

    return (
        <AgencyForm
            isEdit={ mode === 'edit' }
            agency={ agency }
            handleOnSubmit={ onSubmit }
            handleOnDelete={ onDelete }
        />
    );
}

export default AgencyFormContainer;