
import { connectDB } from "./db.config.js";
import { initLocations } from "../services/zoneLocation.services.js";

async function startServer() {
    await connectDB();
    await initLocations();
}

startServer();