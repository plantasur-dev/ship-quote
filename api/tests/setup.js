
import mongoose from "mongoose";

import { connectDB } from '../src/lib/configs/db.config.js';

beforeAll(async () => {
    console.log("Conectando...");
    await connectDB();

    console.log('DB:', mongoose.connection.name);

    console.log("Borrando...");
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
});