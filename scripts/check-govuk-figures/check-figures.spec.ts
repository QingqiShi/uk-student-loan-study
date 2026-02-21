import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "@playwright/test";

import { scrapeGovUk } from "./scrape-govuk";
import type { CheckResult } from "./types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = path.join(__dirname, "results");

test("scrape GOV.UK student loan figures", async ({ page }) => {
  mkdirSync(RESULTS_DIR, { recursive: true });

  try {
    const data = await scrapeGovUk(page);
    writeFileSync(
      path.join(RESULTS_DIR, "scraped-data.json"),
      JSON.stringify(data, null, 2),
    );
  } catch (error) {
    const result: CheckResult = {
      status: "scrape-error",
      error: error instanceof Error ? error.message : String(error),
      checkedAt: new Date().toISOString(),
    };
    writeFileSync(
      path.join(RESULTS_DIR, "check-result.json"),
      JSON.stringify(result, null, 2),
    );
    throw error;
  }
});
