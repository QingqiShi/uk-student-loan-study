import { test, expect, type Page } from "@playwright/test";

// Opt out of the shared already-accepted state; this spec needs a first visit.
test.use({ storageState: { cookies: [], origins: [] } });

const banner = (page: Page) =>
  page.getByRole("region", { name: "Cookie choice" });

// The e2e build points PostHog at an unresolvable host; keep the calls off the
// network so a slow DNS failure can't stall a test.
test.beforeEach(async ({ page }) => {
  await page.route("**://posthog.invalid/**", (route) => route.abort());
});

test.describe("Cookie banner", () => {
  test("appears on a first visit", async ({ page }) => {
    await page.goto("/");

    await expect(banner(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Accept" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Decline" })).toBeVisible();
  });

  test("stays dismissed after accepting", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Accept" }).click();

    await expect(banner(page)).toBeHidden();

    await page.reload();
    await expect(banner(page)).toBeHidden();
  });

  test("stays dismissed after declining", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Decline" }).click();

    await expect(banner(page)).toBeHidden();

    await page.reload();
    await expect(banner(page)).toBeHidden();
  });
});
