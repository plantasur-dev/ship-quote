
import { Navbar, Footer, Jumbotron, Siderbar } from "../../ui";

function LayoutAdminPage ({ children, jumbotron = {} }) {
    
    return (
        <div className="flex min-h-screen bg-canvas">

                <Siderbar />

                <main className="flex-1 space-y-6 p-6 lg:p-8">

                    <Jumbotron { ...jumbotron } />
                    { children }
                    
                </main>
        </div>
    );
}

export default LayoutAdminPage;