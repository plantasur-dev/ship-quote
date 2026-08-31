
import { useParams } from "react-router-dom";
import { useAgency, useAgenciesForm } from "../../../../../hooks";
import LoadingScreen from "../../../../ui/loaders/loader";
import AgencyForm from "./agency-form";

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