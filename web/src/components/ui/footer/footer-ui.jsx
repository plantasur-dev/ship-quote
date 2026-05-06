
function Footer() {
    return (
        <footer className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
            <span className="text-sm text-gray-500">
                © {new Date().getFullYear()} ShipQuote
            </span>
        </footer>
    );
}

export default Footer;