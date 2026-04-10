
import Agency from "../models/agency.model.js";

const agencies = [
    {
        name: "Cayco",
        code: "cayco",
        type: "static",
        active: true,
        rules: {
        hasAndaluciaRule: true,
        supportsPallets: true,
        supportsParcels: false
        }
    },
    {
        name: "Tecum",
        code: "tecum",
        type: "static",
        active: true,
        rules: {
        hasAndaluciaRule: false,
        supportsPallets: true,
        supportsParcels: false
        }
    },
    {
        name: "DHL",
        code: "dhl",
        type: "api",
        active: true,
        rules: {
        hasAndaluciaRule: false,
        supportsPallets: false,
        supportsParcels: true
        }
    }
];

export const seedAgencies = async () => {
    try {
        console.log("🧹 Limpiando colección...");
        await Agency.deleteMany();

        console.log("🌱 Insertando agencias...");
        await Agency.insertMany(agencies);

        console.log("✅ Seed completado");
    } catch (error) {
        console.error("❌ Error en seed:", error);
        process.exit(1);
    }
};