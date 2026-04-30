
import { Alert } from '../../../../ui';

function ErrorsForm({ serverErrors }) {
    return (
        Object.values(serverErrors).length > 0 
            && Object.entries(serverErrors).map(([key, error]) => (
            <Alert 
                key={ key }
                message={ `Service ${ key }: ${ error }` } 
                type="warning" 
                center={ true } 
            />
        ))
    );
}

export default ErrorsForm;