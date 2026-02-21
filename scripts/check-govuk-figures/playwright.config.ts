import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "check-figures.spec.ts",
  retries: 2,
  timeout: 60_000,
});
