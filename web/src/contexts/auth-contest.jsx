
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

    const login = async (email, password) => {
        const user = await ServiceAuth.login(email, password);
        setUser(user);
    }

    const logout = async () => {
        await ServiceAuth.logout();
        setUser(null);
        navigate('/login');
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }} >
            { children }
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;

export const useAuth = () => useContext(AuthContext);