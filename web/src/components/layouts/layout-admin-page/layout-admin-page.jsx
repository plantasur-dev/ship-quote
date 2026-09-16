
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Jumbotron, Siderbar } from "../../ui";
import { AlertProvider } from "../../../contexts/alert-context";

function LayoutAdminPage ({ children, jumbotron = {} }) {

    const { pathname } = useLocation();

    useEffect(() => {
        document.documentElement.scrollTop = 0;
    }, [pathname]);
    
    return (
        <AlertProvider>
            <div className="flex min-h-screen bg-canvas">

                    <Siderbar />

                    <main className="flex min-w-0 flex-1 flex-col gap-6 p-6 lg:p-8">

                        <Jumbotron { ...jumbotron } />
                        
                        <div className="flex min-h-0 flex-1 flex-col gap-6">
                            
                            { children }
                        
                        </div>

                    </main>
            </div>
        </AlertProvider>
    );
}

export default LayoutAdminPage;