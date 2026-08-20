
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-contest";
import { LoadingScreen } from "../components/ui";

function PrivateRouter({ children }) {
    const { user } = useAuth();

    if (user === undefined) return <LoadingScreen />;
    
    if (!user) return <Navigate to='/login'/>
    else return children;
}

export default PrivateRouter;