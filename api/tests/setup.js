
import mongoose from "mongoose";

import { connectDB } from '../src/lib/configs/db.config.js';


if (process.env.NODE_ENV !== 'test') {
  throw new Error('NODE_ENV env var is not test');
}

if (!process.env.MONGODB_URI_TEST?.endsWith('_test')) {
    throw new Error('MONGODB_URI_TEST must point to a *_test database');
}

beforeAll(async () => {
    await connectDB();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }

  vi.clearAllMocks();
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        console.log('Global teardown: closing DB connection...');
        await mongoose.connection.close();
    }
});