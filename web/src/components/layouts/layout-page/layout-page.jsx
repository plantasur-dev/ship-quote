
import { Navbar, Footer, AlertRelease } from "../../ui";

function LayoutPage ({ children }) {
    
    return (
        <>
            <main
                className="
                    min-h-screen
                    bg-gradient-to-br
                    from-slate-50
                    via-slate-50
                    to-indigo-50/30
                "
            >
                <AlertRelease />
                
                <Navbar />
                    { children }
                <Footer />
            </main>
        </>
    );
}

export default LayoutPage;