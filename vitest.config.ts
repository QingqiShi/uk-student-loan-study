import { realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// Resolve setup files to absolute paths so Vite doesn't misresolve bare
// specifiers through the main repo's node_modules when running in a git
// worktree (where .git is a file pointing back to the primary checkout).
const require = createRequire(import.meta.url);

// In git worktrees, node_modules is a symlink to the main repo's node_modules.
// require.resolve follows the symlink and returns the real path inside the main
// repo, which is outside the worktree root. Vite's dev server blocks /@fs/
// requests to paths outside the allowed roots, so we must explicitly allow the
// real node_modules directory.
const resolvedWebWorker = require.resolve("@vitest/web-worker");
const realNodeModulesDir = dirname(
  realpathSync(new URL("node_modules", import.meta.url)),
);

export default defineConfig({
  plugins: [
    react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
    tsconfigPaths(),
  ],
  server: {
    fs: {
      allow: [realNodeModulesDir],
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: [resolvedWebWorker, "./src/test/setup.ts"],
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
