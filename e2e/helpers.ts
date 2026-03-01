import { expect, type Page } from "@playwright/test";

/**
 * Locates the "Your Loan Breakdown" insight cards section.
 */
function insightCardsSection(page: Page) {
  return page.locator("section").filter({ hasText: "Your Loan Breakdown" });
}

/**
 * Waits for the insight cards to show computed values (not skeleton/loading).
 * Looks for a currency value (e.g. "£45,000") inside the cards section.
 */
export async function waitForResults(page: Page) {
  await insightCardsSection(page)
    .getByText(/£[\d,]+/)
    .first()
    .waitFor({ state: "visible", timeout: 15_000 });
}

/**
 * Extracts the first insight card stat value (used to detect changes).
 */
export async function getResultValues(page: Page) {
  const firstStat = insightCardsSection(page)
    .locator(".font-mono.text-xl")
    .first();
  const totalText = await firstStat.textContent();

  return { totalText };
}

/**
 * Waits for the first insight card stat to differ from a known previous value.
 * Uses Playwright's auto-retrying assertion to poll until the value changes.
 */
export async function waitForResultChange(
  page: Page,
  previousTotal: string | null,
) {
  const firstStat = insightCardsSection(page)
    .locator(".font-mono.text-xl")
    .first();

  await expect(firstStat).not.toHaveText(previousTotal ?? "", {
    timeout: 15_000,
  });
}

/**
 * Clicks a preset pill button by its visible label.
 */
export async function clickPreset(page: Page, label: string) {
  await page.getByRole("button", { name: label }).click();
}
