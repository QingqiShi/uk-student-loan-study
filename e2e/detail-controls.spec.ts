import { test, expect, type Page } from "@playwright/test";

// The "Adjust for inflation" toggle and the interpretive insight text used to
// live on the homepage. The Instrument redesign moved both onto the detail
// pages (the shared ControlBar + each detail page's insight paragraph), so
// these flows are exercised here on /repaid where they now live.
test.describe("Detail page controls (/repaid)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/repaid?loans=PLAN_2:45000&sal=50000");
  });

  function totalRepaid(page: Page) {
    // The hero readout's first (emphasis) figure is "Total repaid".
    return page
      .locator('[data-slot="metric-readout"]')
      .first()
      .locator(".font-mono")
      .first();
  }

  test("toggling inflation adjustment changes total repayment", async ({
    page,
  }) => {
    const total = totalRepaid(page);
    await expect(total).toContainText(/£[\d,]+/, { timeout: 15_000 });
    const before = await total.textContent();

    await page.getByRole("switch", { name: "Adjust for inflation" }).click();

    await expect(total).not.toHaveText(before ?? "", { timeout: 10_000 });
  });

  test("interpretive insight text appears on page", async ({ page }) => {
    await expect(page.getByText(/Your repayments start at/)).toBeVisible({
      timeout: 15_000,
    });
  });
});
