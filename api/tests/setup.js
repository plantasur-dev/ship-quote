
import mongoose from "mongoose";

import { connectDB } from '../src/lib/configs/db.config.js';

beforeAll(async () => {
    await connectDB();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        console.log('Global teardown: closing DB connection...');
        await mongoose.connection.close();
    }
});