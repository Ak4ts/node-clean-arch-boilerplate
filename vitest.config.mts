import { defineConfig } from "vitest/config";

export default defineConfig({
  // Vite resolves the @domain/@infra/@usecases/@main aliases straight from
  // tsconfig.json. This replaced the vite-tsconfig-paths plugin, which Vite
  // now reports as redundant.
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],
    setupFiles: ["test/setup.ts"],
    env: {
      NODE_ENV: "test",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
      // Barrels re-export only, and server.ts is the process bootstrap: neither
      // holds behaviour a test could pin.
      exclude: ["src/**/index.ts", "src/server.ts", "src/**/*.test.ts"],
      // Ratchet: raise these as suites land, never lower them to make a build
      // pass. The uncovered remainder is the MySQL branch of connection.ts and
      // the file transports in logger.ts, neither of which runs under test.
      thresholds: {
        lines: 90,
        functions: 100,
        branches: 80,
        statements: 90,
      },
    },
  },
});
