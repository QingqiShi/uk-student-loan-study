import AxeBuilder from "@axe-core/playwright";
import { type Page, test, expect } from "@playwright/test";

// Pre-existing violations tracked separately — these rules are excluded so
// the e2e suite catches *new* regressions without failing on known issues.
const DISABLED_RULES = [
  "color-contrast", // Multiple elements have insufficient contrast (tracked)
  "label", // Some balance inputs in wizard lack explicit labels (tracked)
];

function axeScan(page: Page) {
  return new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .disableRules(DISABLED_RULES);
}

test.describe("Accessibility", () => {
  test("home page has no WCAG 2.1 AA violations", async ({ page }) => {
    await page.goto("/");
    // Wait for results to load so we test the full rendered page
    await page
      .locator("[role='status'][aria-live='polite']")
      .getByText(/£[\d,]+/)
      .first()
      .waitFor({ state: "visible", timeout: 15_000 });

    const results = await axeScan(page).analyze();
    expect(results.violations).toEqual([]);
  });

  test("quiz page has no WCAG 2.1 AA violations", async ({ page }) => {
    await page.goto("/which-plan");
    await expect(page.getByText("Where did you study?")).toBeVisible();

    const results = await axeScan(page).analyze();
    expect(results.violations).toEqual([]);
  });

  test("overpay page has no WCAG 2.1 AA violations", async ({ page }) => {
    await page.goto("/overpay");
    // Wait for verdict to load
    const verdict = page.locator("[role='status'][aria-live='polite']").first();
    await expect(verdict).toBeVisible({ timeout: 15_000 });

    const results = await axeScan(page).analyze();
    expect(results.violations).toEqual([]);
  });

  test("config wizard dialog has no WCAG 2.1 AA violations", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .locator("[role='status'][aria-live='polite']")
      .getByText(/£[\d,]+/)
      .first()
      .waitFor({ state: "visible", timeout: 15_000 });

    // Open the wizard
    await page.getByRole("button", { name: "Tailor to you" }).click();
    await expect(
      page.getByRole("dialog", { name: "Configure your loans" }),
    ).toBeVisible();

    const results = await axeScan(page).analyze();
    expect(results.violations).toEqual([]);
  });

  test("skip-to-content link is keyboard accessible", async ({ page }) => {
    await page.goto("/");
    await page
      .locator("[role='status'][aria-live='polite']")
      .getByText(/£[\d,]+/)
      .first()
      .waitFor({ state: "visible", timeout: 15_000 });

    // Tab to reveal the skip link
    await page.keyboard.press("Tab");
    const skipLink = page.getByText("Skip to main content");
    await expect(skipLink).toBeVisible();

    // Activate it — should scroll to main content (anchor navigation)
    await page.keyboard.press("Enter");

    // Verify the URL hash changed to #main-content
    await expect(page).toHaveURL(/#main-content/);
  });
});
