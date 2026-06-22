
import mongoose from "mongoose";
import '../src/lib/configs/db.config.js';

beforeAll(async () => {
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
});