
import { useParams } from "react-router-dom";
import { ErrorState } from "../../../../ui";
import LoadingScreen from "../../../../ui/loaders/loader";
import AgencyForm from "./agency-form";
import { useAgency, useAgenciesForm } from "../../../../../hooks";


function AgencyFormContainer({ mode }) {

    const { agencyId } = useParams();

    const { agency, isLoading: isLoadingAgency, error } = useAgency({ agencyId });

    const { onSubmit, onDelete, isLoadingDeleting } = useAgenciesForm({ mode, agencyId });

    if (isLoadingAgency) {
        return <LoadingScreen label={ `Cargando carrier...`}/>;
    }

    if (isLoadingDeleting) {
        return <LoadingScreen label={ `Eliminando carrier...`}/>;
    }

    if (error !== null) {
        return <ErrorState 
            variant={ error?.type } 
            code={ error?.status }
        />
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