import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html"]] : "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.storage/consent.json",
      },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: process.env.CI ? "pnpm start" : "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Locally `pnpm dev` inlines these per request, so the cookie banner
    // renders without a .env.local. In CI the same values are set on the
    // build step instead. The host never resolves; specs abort calls to it.
    env: {
      NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: "phc_e2e_placeholder",
      NEXT_PUBLIC_POSTHOG_HOST: "https://posthog.invalid",
    },
  },
});
