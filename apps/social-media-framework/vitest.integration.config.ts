import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.integration.test.ts"],
    exclude: ["**/*.spec.ts"],
    testTimeout: 60000,
    hookTimeout: 60000,
    setupFiles: ["./test/setup.integration.ts"],
    environment: "node",
  },
});
