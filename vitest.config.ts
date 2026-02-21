import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
    tsconfigPaths(),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["@vitest/web-worker", "./src/test/setup.ts"],
    exclude: ["e2e/**", "scripts/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: { lines: 20, functions: 20, branches: 14, statements: 20 },
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    },
  },
});
