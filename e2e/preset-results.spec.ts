import { test, expect } from "@playwright/test";
import {
  waitForResults,
  waitForResultChange,
  getResultValues,
  clickPreset,
  readoutSection,
} from "./helpers";

test.describe("Home page preset selection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForResults(page);
  });

  test("default preset loads results with £ values", async ({ page }) => {
    const section = readoutSection(page);
    await expect(section.getByText("Total repaid").first()).toBeVisible();
    await expect(section.getByText("Payoff timeline").first()).toBeVisible();
    await expect(section.getByText("Interest paid").first()).toBeVisible();
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

  test("clicking Undergraduate + Masters preset shows combined results", async ({
    page,
  }) => {
    const before = await getResultValues(page);

    await clickPreset(page, "Undergraduate + Masters");
    await waitForResultChange(page, before.totalText);

    const after = await getResultValues(page);
    expect(after.totalText).not.toBe(before.totalText);
  });
});
