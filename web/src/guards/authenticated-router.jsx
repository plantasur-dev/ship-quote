
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { LoadingScreen } from "../components/ui";

function AuthenticatedRouter({ children }) {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) return <LoadingScreen />;

    if (user) return <Navigate to='/admin/dashboard' replace />
    
    return children;
}

export default AuthenticatedRouter;