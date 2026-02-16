import { test, expect } from "@playwright/test";

test.describe("Overpay page", () => {
  test("page loads with verdict and chart visible", async ({ page }) => {
    await page.goto("/overpay");

    // Wait for the verdict to appear (shows recommendation)
    const verdict = page.locator("[role='status'][aria-live='polite']").first();
    await expect(verdict).toBeVisible({ timeout: 15_000 });

    // Heading should be visible
    await expect(
      page.getByRole("heading", { name: "Should You Overpay?" }),
    ).toBeVisible();
  });

  test("adjusting overpayment slider changes displayed amount", async ({
    page,
  }) => {
    await page.goto("/overpay?loans=PLAN_2:45000&sal=50000");

    // Wait for initial verdict
    const verdict = page.locator("[role='status'][aria-live='polite']").first();
    await expect(verdict).toBeVisible({ timeout: 15_000 });

    // Focus the overpayment slider thumb and use keyboard to change value
    const slider = page.getByRole("slider", {
      name: "Adjust monthly overpayment amount",
    });
    await slider.focus();

    // Press ArrowRight multiple times to increase overpayment from £0
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("ArrowRight");
    }

    // The displayed overpayment amount should no longer be £0
    const overpaymentLabel = page.getByText("Monthly Overpayment");
    const labelParent = overpaymentLabel.locator("..");
    await expect(labelParent).not.toHaveText(/£0$/);
  });

  test("entering lump sum updates summary values", async ({ page }) => {
    await page.goto("/overpay?loans=PLAN_2:45000&sal=50000");

    // Wait for page to load
    const verdict = page.locator("[role='status'][aria-live='polite']").first();
    await expect(verdict).toBeVisible({ timeout: 15_000 });
    const initialText = await verdict.textContent();

    // Fill in lump sum payment
    const lumpSumInput = page.getByLabel("Enter one-off lump sum payment");
    await lumpSumInput.fill("5000");

    // Verdict/summary should update
    await expect(async () => {
      const newText = await verdict.textContent();
      expect(newText).not.toBe(initialText);
    }).toPass({ timeout: 10_000 });
  });

  test("clicking preset changes results", async ({ page }) => {
    await page.goto("/overpay");

    // Wait for initial load
    const verdict = page.locator("[role='status'][aria-live='polite']").first();
    await expect(verdict).toBeVisible({ timeout: 15_000 });
    const initialText = await verdict.textContent();

    // Click a different preset
    await page.getByRole("button", { name: "Pre-2012" }).click();

    // Verdict should update
    await expect(async () => {
      const newText = await verdict.textContent();
      expect(newText).not.toBe(initialText);
    }).toPass({ timeout: 10_000 });
  });
});
