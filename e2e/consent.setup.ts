import { test as setup } from "@playwright/test";

export const CONSENT_STATE = "e2e/.storage/consent.json";

// Every spec except cookie-banner.spec.ts runs with cookies already accepted,
// so the fixed banner can't sit over the controls they click.
setup("accept cookies", async ({ page }) => {
  await page.route("**://posthog.invalid/**", (route) => route.abort());

  await page.goto("/");
  await page.getByRole("button", { name: "Accept" }).click();
  await page.getByRole("region", { name: "Cookie choice" }).waitFor({
    state: "hidden",
  });

  await page.context().storageState({ path: CONSENT_STATE });
});
