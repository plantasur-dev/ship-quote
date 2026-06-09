
import { Alert } from '../../../../ui';

function ErrorsForm({ serverErrors = {} }) {
    const entries = Object.entries(serverErrors);

    if (!entries.length) return null;

    return entries.map(([key, error]) => {
        const message = typeof error === 'string'
            ? error
            : error?.message || JSON.stringify(error, null, 0);

        return (
            <Alert 
                key={ key }
                message={`${ key }: ${ message }`} 
                type= { error?.type ?? 'warning' }
                center={ true } 
            />
        );
    });
}

export default ErrorsForm;