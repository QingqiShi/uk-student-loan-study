import { test, expect } from "@playwright/test";

test.describe("Quiz flow at /which-plan", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/which-plan");
    await expect(page.getByText("Where did you study?")).toBeVisible();
  });

  test("England → 2012-2022 → no additional course → no postgrad → shows Plan 2", async ({
    page,
  }) => {
    await page.getByRole("radio", { name: "England" }).click();
    await expect(
      page.getByText("When did you start your course?"),
    ).toBeVisible();

    await page.getByRole("radio", { name: /2012 – 2022/ }).click();
    await expect(
      page.getByText(/Did you start another course after/),
    ).toBeVisible();

    // Answer "No" to additional course question
    await page.getByRole("radio", { name: /Just the one course/ }).click();
    await expect(
      page.getByText("Did you go on to study a Master's or PhD?"),
    ).toBeVisible();

    // Answer "No" to postgrad question
    await page.getByRole("radio", { name: /No postgraduate study/ }).click();
    await expect(
      page.getByRole("heading", { name: "Plan 2", level: 1 }),
    ).toBeVisible();
  });

  test("Scotland → skips start year → no postgrad → shows Plan 4", async ({
    page,
  }) => {
    await page.getByRole("radio", { name: "Scotland" }).click();

    // Should skip start year, go directly to postgrad
    await expect(
      page.getByText("Did you go on to study a Master's or PhD?"),
    ).toBeVisible();

    await page.getByRole("radio", { name: /No postgraduate study/ }).click();
    await expect(
      page.getByRole("heading", { name: "Plan 4", level: 1 }),
    ).toBeVisible();
  });

  test("England → 2023+ → no postgrad → shows Plan 5", async ({ page }) => {
    await page.getByRole("radio", { name: "England" }).click();
    await expect(
      page.getByText("When did you start your course?"),
    ).toBeVisible();

    // 2023 or later skips the additional course question
    await page.getByRole("radio", { name: "2023 or later" }).click();
    await expect(
      page.getByText("Did you go on to study a Master's or PhD?"),
    ).toBeVisible();

    await page.getByRole("radio", { name: /No postgraduate study/ }).click();
    await expect(
      page.getByRole("heading", { name: "Plan 5", level: 1 }),
    ).toBeVisible();
  });

  test("back button returns to previous question", async ({ page }) => {
    await page.getByRole("radio", { name: "England" }).click();
    await expect(
      page.getByText("When did you start your course?"),
    ).toBeVisible();

    await page.getByLabel("Go back").click();
    await expect(page.getByText("Where did you study?")).toBeVisible();
  });

  test("Enter your balances button navigates to home with wizard", async ({
    page,
  }) => {
    // Complete the quiz via Scotland (shorter path)
    await page.getByRole("radio", { name: "Scotland" }).click();
    await page.getByRole("radio", { name: /No postgraduate study/ }).click();

    await expect(
      page.getByRole("heading", { name: "Plan 4", level: 1 }),
    ).toBeVisible();

    // Click "Enter your balances" which navigates to home
    await page.getByText(/Enter your balances/).click();
    await page.waitForURL("/");

    // The config wizard dialog should open
    await expect(
      page.getByRole("dialog", { name: "Configure your loans" }),
    ).toBeVisible();
  });
});
