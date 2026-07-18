import { expect, type Page } from "@playwright/test";

/**
 * Locates the homepage "Your loan breakdown" readout region — the Instrument
 * `Readout` component that renders the computed results.
 */
export function readoutSection(page: Page) {
  return page.locator('[data-slot="readout"]');
}

/**
 * The headline "Total repaid" figure (mono, drill-down link to /repaid). Only
 * present once results have computed — a skeleton renders in its place while
 * the simulation is still running.
 */
function totalFigure(page: Page) {
  return page.locator('[data-slot="metric-total"] [data-slot="metric-value"]');
}

/**
 * Waits for the readout to show computed values (not skeleton/loading).
 * The headline "Total repaid" figure only renders once results are ready.
 */
export async function waitForResults(page: Page) {
  await expect(totalFigure(page)).toContainText(/£[\d,]+/, { timeout: 15_000 });
}

/**
 * Extracts the headline "Total repaid" figure (used to detect changes).
 */
export async function getResultValues(page: Page) {
  const totalText = await totalFigure(page).textContent();

  return { totalText };
}

/**
 * Waits for the headline "Total repaid" figure to differ from a known previous
 * value. Uses Playwright's auto-retrying assertion to poll until it changes.
 */
export async function waitForResultChange(
  page: Page,
  previousTotal: string | null,
) {
  await expect(totalFigure(page)).not.toHaveText(previousTotal ?? "", {
    timeout: 15_000,
  });
}

/**
 * Clicks a preset pill button by its visible label.
 */
export async function clickPreset(page: Page, label: string) {
  await page.getByRole("button", { name: label }).click();
}

/**
 * Opens the "Configure your loans" dialog from the homepage.
 *
 * "Tailor to you" now appears on two controls — the readout assumptions link
 * and the scenario preset — so this targets the preset button in the controls
 * region unambiguously.
 */
export async function openConfigWizard(page: Page) {
  await page
    .locator('[data-slot="controls"]')
    .getByRole("button", { name: "Tailor to you" })
    .click();
}
