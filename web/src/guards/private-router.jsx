
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { LoadingScreen } from "../components/ui";

function PrivateRouter({ children }) {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) return <LoadingScreen />;
    
    if (!user) return <Navigate to='/login' replace />
    else return children;
}

export default PrivateRouter;