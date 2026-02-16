import type { Page } from "@playwright/test";

/**
 * Waits for the result summary to show computed values (not skeleton/loading).
 * Looks for a currency value (e.g. "£45,000") inside the live results region.
 */
export async function waitForResults(page: Page) {
  await page
    .locator("[role='status'][aria-live='polite']")
    .getByText(/£[\d,]+/)
    .first()
    .waitFor({ state: "visible", timeout: 15_000 });
}

/**
 * Extracts the three headline result values from the ResultSummary component.
 */
export async function getResultValues(page: Page) {
  const results = page.locator("[role='status'][aria-live='polite']");
  const totalText = await results
    .getByText("Total repayment")
    .locator("..")
    .textContent();
  const monthlyText = await results
    .getByText("Monthly")
    .locator("..")
    .textContent();
  const durationText = await results
    .getByText("Duration")
    .locator("..")
    .textContent();

  return { totalText, monthlyText, durationText };
}

/**
 * Clicks a preset pill button by its visible label.
 */
export async function clickPreset(page: Page, label: string) {
  await page.getByRole("button", { name: label }).click();
}
