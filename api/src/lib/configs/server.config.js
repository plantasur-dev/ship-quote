
import { connectDB } from "./db.config.js";
import { initLocations } from "../../api/services/zoneLocation.service.js";

async function startServer() {
    await connectDB();
    await initLocations();
}

startServer();