
import { useParams } from "react-router-dom";
import AgencyForm from "./agency-form";
import { useAgenciesForm } from "../../../../../hooks/use-agencies-form"; 

function AgencyFormContainer({ mode }) {

    const { agencyId } = useParams();

    const { onSubmit } = useAgenciesForm({ mode, agencyId });

    return <AgencyForm mode={ mode } handleOnSubmit={ onSubmit }/>

}

export default AgencyFormContainer;