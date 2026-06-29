
import { defineConfig } from "vitest/config";

import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./tests/setup.js"],
    include: ["**/tests/**/*.test.js"],
    testTimeout: 10000,
    fileParallelism: false,
  },
});