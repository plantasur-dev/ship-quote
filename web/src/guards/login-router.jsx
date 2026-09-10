
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

function LoginRouter({ children }) {
    const { user } = useAuth();

    if (user) return <Navigate to='/admin/dashboard' replace />
    
    return children;
}

export default LoginRouter;