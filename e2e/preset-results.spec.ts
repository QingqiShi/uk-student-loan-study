import { test, expect } from "@playwright/test";
import { waitForResults, getResultValues, clickPreset } from "./helpers";

test.describe("Home page preset selection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForResults(page);
  });

  test("default preset loads results with £ values", async ({ page }) => {
    const results = page.locator("[role='status'][aria-live='polite']");
    await expect(results.getByText("Total repayment")).toBeVisible();
    await expect(results.getByText("Monthly")).toBeVisible();
    await expect(results.getByText("Duration")).toBeVisible();
    await expect(results.getByText(/£[\d,]+/).first()).toBeVisible();
  });

  test("clicking 2023+ Grad preset changes result values", async ({ page }) => {
    const before = await getResultValues(page);

    await clickPreset(page, "2023+ Grad");
    await waitForResults(page);

    const after = await getResultValues(page);
    expect(after.totalText).not.toBe(before.totalText);
  });

  test("clicking Pre-2012 preset shows different results", async ({ page }) => {
    const before = await getResultValues(page);

    await clickPreset(page, "Pre-2012");
    await waitForResults(page);

    const after = await getResultValues(page);
    expect(after.totalText).not.toBe(before.totalText);
  });

  test("clicking UG + Masters preset shows combined results", async ({
    page,
  }) => {
    const before = await getResultValues(page);

    await clickPreset(page, "UG + Masters");
    await waitForResults(page);

    const after = await getResultValues(page);
    expect(after.totalText).not.toBe(before.totalText);
  });

  test("insight text appears below results", async ({ page }) => {
    const results = page.locator("[role='status'][aria-live='polite']");
    // Insight footer has a title (bold text) and description
    await expect(results.locator(".font-medium").first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
