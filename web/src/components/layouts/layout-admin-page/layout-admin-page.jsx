
import { Jumbotron, Siderbar } from "../../ui";
import { AlertProvider } from "../../../contexts/alert-context";

function LayoutAdminPage ({ children, jumbotron = {} }) {
    
    return (
        <AlertProvider>
            <div className="flex min-h-screen bg-canvas">

                    <Siderbar />

                    <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-6 lg:p-8">

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