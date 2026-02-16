import { test, expect } from "@playwright/test";
import { waitForResults } from "./helpers";

test.describe("Share URL round-trip", () => {
  test("loads results from new-format loans param", async ({ page }) => {
    await page.goto("/?loans=PLAN_2:45000&sal=50000");
    await waitForResults(page);

    const results = page.locator("[role='status'][aria-live='polite']");
    await expect(results.getByText(/£[\d,]+/).first()).toBeVisible();
    await expect(results.getByText("Total repayment")).toBeVisible();
    await expect(results.getByText("Monthly")).toBeVisible();
    await expect(results.getByText("Duration")).toBeVisible();
  });

  test("loads results from legacy plan/ug/sal params", async ({ page }) => {
    await page.goto("/?plan=PLAN_2&ug=45000&sal=65000");
    await waitForResults(page);

    const results = page.locator("[role='status'][aria-live='polite']");
    await expect(results.getByText(/£[\d,]+/).first()).toBeVisible();
  });

  test("loads combined plans from comma-separated loans param", async ({
    page,
  }) => {
    await page.goto("/?loans=PLAN_2:45000,POSTGRADUATE:12000&sal=50000");
    await waitForResults(page);

    const results = page.locator("[role='status'][aria-live='polite']");
    await expect(results.getByText(/£[\d,]+/).first()).toBeVisible();
  });

  test("loads overpay page with overpay params", async ({ page }) => {
    await page.goto("/overpay?loans=PLAN_2:45000&sal=50000&ovp=200&lsp=5000");

    // Wait for the overpay verdict to appear
    const verdict = page.locator("[role='status'][aria-live='polite']").first();
    await expect(verdict).toBeVisible({ timeout: 15_000 });
  });

  test("renders default results with invalid params", async ({ page }) => {
    await page.goto("/?loans=INVALID:abc&sal=notanumber");

    // Should not crash — default preset loads instead
    await waitForResults(page);
    const results = page.locator("[role='status'][aria-live='polite']");
    await expect(results.getByText(/£[\d,]+/).first()).toBeVisible();
  });
});
