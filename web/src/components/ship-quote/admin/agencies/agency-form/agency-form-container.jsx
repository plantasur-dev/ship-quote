
import { useParams } from "react-router-dom";
import { useAgency } from "../../../../../hooks/use-agency";
import LoadingScreen from "../../../../ui/loaders/loader";
import AgencyForm from "./agency-form";
import { useAgenciesForm } from "../../../../../hooks/use-agencies-form"; 

function AgencyFormContainer({ mode }) {

    const { agencyId } = useParams();

    const { agency, isLoading: isLoadingAgency } = useAgency(agencyId);

    const { onSubmit } = useAgenciesForm({ mode, agencyId });

    if (isLoadingAgency) {
        return <LoadingScreen label={ `Cargando carrier...`}/>;
    }

    const isEdit = mode === 'edit';

    return (
        <AgencyForm
            isEdit={ isEdit }
            agency={ agency }
            handleOnSubmit={ onSubmit }
        />
    );
}

export default AgencyFormContainer;