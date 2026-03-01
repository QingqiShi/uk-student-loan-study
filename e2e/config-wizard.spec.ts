import { test, expect } from "@playwright/test";
import {
  waitForResults,
  getResultValues,
  waitForResultChange,
} from "./helpers";

test.describe("Config wizard dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForResults(page);
  });

  test("clicking Tailor to you opens the wizard dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Tailor to you" }).click();
    await expect(
      page.getByRole("dialog", { name: "Configure your loans" }),
    ).toBeVisible();
    await expect(page.getByText("Customise your loans")).toBeVisible();
  });

  test("toggle plan checkbox + enter balance → Done becomes enabled", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Tailor to you" }).click();
    const dialog = page.getByRole("dialog", { name: "Configure your loans" });

    // Done should be disabled initially
    const doneButton = dialog.getByRole("button", { name: "Done" });
    await expect(doneButton).toBeDisabled();

    // Click Plan 2 checkbox to toggle it on
    await dialog.getByRole("checkbox", { name: /Plan 2/ }).click();

    // Enter a balance using a quick pick
    await dialog.getByRole("button", { name: "£45k" }).click();

    // Done should now be enabled
    await expect(doneButton).toBeEnabled();
  });

  test("clicking Done closes dialog and changes result values", async ({
    page,
  }) => {
    const before = await getResultValues(page);

    await page.getByRole("button", { name: "Tailor to you" }).click();
    const dialog = page.getByRole("dialog", { name: "Configure your loans" });

    // Select Plan 5 with £40k — different enough to produce a distinct total
    await dialog.getByRole("checkbox", { name: /Plan 5/ }).click();
    await dialog.getByRole("button", { name: "£40k" }).click();

    // Click Done
    await dialog.getByRole("button", { name: "Done" }).click();

    // Dialog should close
    await expect(dialog).toBeHidden();

    // Results should change (auto-retries until value differs)
    await waitForResultChange(page, before.totalText);
  });

  test("clicking Close closes dialog without changing results", async ({
    page,
  }) => {
    const before = await getResultValues(page);

    await page.getByRole("button", { name: "Tailor to you" }).click();
    const dialog = page.getByRole("dialog", { name: "Configure your loans" });

    // Click Close button
    await dialog.getByLabel("Close").click();

    // Dialog should close
    await expect(dialog).toBeHidden();

    // Results should remain unchanged
    await waitForResults(page);
    const after = await getResultValues(page);
    expect(after.totalText).toBe(before.totalText);
  });

  test("Not sure? Take the quiz button switches to quiz view", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Tailor to you" }).click();
    const dialog = page.getByRole("dialog", { name: "Configure your loans" });

    await dialog
      .getByRole("button", { name: /Not sure\? Take the quiz/ })
      .click();

    // Quiz region question should appear inside the dialog
    await expect(page.getByText("Where did you study?")).toBeVisible();
  });

  test("selecting multiple plans + Done → combined results on home page", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Tailor to you" }).click();
    const dialog = page.getByRole("dialog", { name: "Configure your loans" });

    // Select Plan 2 with balance
    await dialog.getByRole("checkbox", { name: /Plan 2/ }).click();
    await dialog.getByRole("button", { name: "£45k" }).click();

    // Select Postgraduate with balance
    await dialog.getByRole("checkbox", { name: /Postgraduate/ }).click();
    await dialog.getByRole("button", { name: "£12k" }).click();

    // Click Done
    await dialog.getByRole("button", { name: "Done" }).click();

    // Dialog should close
    await expect(dialog).toBeHidden();

    // Results should load with combined plan values
    await waitForResults(page);
    const section = page
      .locator("section")
      .filter({ hasText: "Your Loan Breakdown" });
    await expect(section.getByText(/£[\d,]+/).first()).toBeVisible();
  });
});
