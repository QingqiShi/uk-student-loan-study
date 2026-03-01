import { test, expect } from "@playwright/test";
import {
  waitForResults,
  waitForResultChange,
  getResultValues,
  clickPreset,
} from "./helpers";

test.describe("Home page preset selection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForResults(page);
  });

  test("default preset loads results with £ values", async ({ page }) => {
    const section = page
      .locator("section")
      .filter({ hasText: "Your Loan Breakdown" });
    await expect(section.getByText("Payoff Timeline")).toBeVisible();
    await expect(section.getByText("Balance Over Time")).toBeVisible();
    await expect(section.getByText("Interest Paid")).toBeVisible();
    await expect(section.getByText(/£[\d,]+/).first()).toBeVisible();
  });

  test("clicking 2023+ Grad preset changes result values", async ({ page }) => {
    const before = await getResultValues(page);

    await clickPreset(page, "2023+ Grad");
    await waitForResultChange(page, before.totalText);

    const after = await getResultValues(page);
    expect(after.totalText).not.toBe(before.totalText);
  });

  test("clicking Pre-2012 preset shows different results", async ({ page }) => {
    const before = await getResultValues(page);

    await clickPreset(page, "Pre-2012");
    await waitForResultChange(page, before.totalText);

    const after = await getResultValues(page);
    expect(after.totalText).not.toBe(before.totalText);
  });

  test("clicking UG + Masters preset shows combined results", async ({
    page,
  }) => {
    const before = await getResultValues(page);

    await clickPreset(page, "UG + Masters");
    await waitForResultChange(page, before.totalText);

    const after = await getResultValues(page);
    expect(after.totalText).not.toBe(before.totalText);
  });

  test("toggling inflation adjustment changes total repayment", async ({
    page,
  }) => {
    const before = await getResultValues(page);

    await page.getByRole("switch", { name: "Adjust for inflation" }).click();
    await waitForResultChange(page, before.totalText);

    const after = await getResultValues(page);
    expect(after.totalText).not.toBe(before.totalText);
  });

  test("insight text appears on page", async ({ page }) => {
    // Desktop: InsightBadge (last match) is visible next to the chart heading
    // (the first match is the mobile-only InsightCallout, hidden at desktop viewport)
    await expect(
      page
        .getByText(
          /peak repayment zone|loan will be written off|pay off quickly/,
        )
        .last(),
    ).toBeVisible({
      timeout: 15_000,
    });
  });
});
