
import { Navbar } from "../../ui";

function LayoutPage ({ children }) {
    
    return (
        <>
            <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 text-slate-800">
                <Navbar />

                { children }
            </main>
        </>
    );
}

export default LayoutPage;