
import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as ServiceAuth from '../services/auth-service';

const AuthContext = createContext();

function AuthContextProvider ({ children }) {

    const navigate = useNavigate();
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const user = await ServiceAuth.verify();
                setUser(user);
            } catch (error) {
                setUser(null);
            }
        };

        verifySession();
    }, []);

    useEffect(() => {
        const handleSessionExpired = () => {
            setUser(null);
            navigate('/login');
        };

        window.addEventListener(
            'auth:session-expired', 
            handleSessionExpired
        );
        return () => {
            window.removeEventListener(
                'auth:session-expired', 
                handleSessionExpired);
            };
    }, [navigate]);

    const login = async (email, password) => {
        const user = await ServiceAuth.login(email, password);
        setUser(user);
    }

    const logout = async () => {
        try {
            await ServiceAuth.logout();
        } finally {
            setUser(null);
            navigate('/login');
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthLoading: user === undefined }} >
            { children }
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;

export const useAuth = () => useContext(AuthContext);