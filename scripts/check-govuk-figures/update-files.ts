import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  PLAN_CONFIGS,
  CURRENT_RATES,
  TUITION_FEE_CAP,
  LAST_UPDATED,
} from "../../src/lib/loans/plans";

import {
  generateLlmsTxt,
  generatePlansTestTs,
  generatePlansTs,
} from "./templates";
import { findRepaymentRate, findRpi, findWriteOffYears } from "./types";
import type { CheckResult, Mismatch, ScrapedGovUkData } from "./types";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "../..");
const resultsDir = path.join(scriptDir, "results");

async function fetchBoeBaseRate(): Promise<number> {
  const url =
    "https://www.bankofengland.co.uk/boeapps/database/fromshowcolumns.asp?csv.x=yes&SeriesCodes=IUDBEDR&UsingCodes=Y&CSVF=TN&Datefrom=01/Jan/2024&Dateto=01/Jan/2027";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch BoE base rate: ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();

  // The BoE endpoint returns HTML with rate data embedded in JavaScript objects
  // as "Value": "3.75" entries. Extract all values and take the last one.
  const valueMatches = [...html.matchAll(/"Value":\s*"([\d.]+)"/g)];
  if (valueMatches.length > 0) {
    const lastMatch = valueMatches[valueMatches.length - 1];
    const rate = parseFloat(lastMatch[1]);
    if (!isNaN(rate)) return rate;
  }

  // Fallback: parse from HTML table rows like <td>3.75</td>
  const tdMatches = [
    ...html.matchAll(
      /<td[^>]*align="right"[^>]*>\s*\n?\s*([\d.]+)\s*\n?\s*<\/td>/g,
    ),
  ];
  if (tdMatches.length > 0) {
    const lastTd = tdMatches[tdMatches.length - 1];
    const rate = parseFloat(lastTd[1]);
    if (!isNaN(rate)) return rate;
  }

  throw new Error("Could not extract BoE base rate from response");
}

function comparePlans(scraped: ScrapedGovUkData): Mismatch[] {
  const mismatches: Mismatch[] = [];

  const planKeys = [
    "PLAN_1",
    "PLAN_2",
    "PLAN_4",
    "PLAN_5",
    "POSTGRADUATE",
  ] as const;

  for (const planKey of planKeys) {
    const currentPlan = PLAN_CONFIGS[planKey];
    const scrapedThreshold = scraped.thresholds.find((t) => t.plan === planKey);

    if (scrapedThreshold) {
      if (currentPlan.monthlyThreshold !== scrapedThreshold.monthlyThreshold) {
        mismatches.push({
          field: `${planKey}.monthlyThreshold`,
          current: currentPlan.monthlyThreshold,
          scraped: scrapedThreshold.monthlyThreshold,
        });
      }
    }

    const scrapedRate = findRepaymentRate(scraped, planKey);
    if (currentPlan.repaymentRate !== scrapedRate) {
      mismatches.push({
        field: `${planKey}.repaymentRate`,
        current: currentPlan.repaymentRate,
        scraped: scrapedRate,
      });
    }

    const scrapedWriteOff = findWriteOffYears(scraped, planKey);
    if (currentPlan.writeOffYears !== scrapedWriteOff) {
      mismatches.push({
        field: `${planKey}.writeOffYears`,
        current: currentPlan.writeOffYears,
        scraped: scrapedWriteOff,
      });
    }
  }

  // Plan 2 interest scale
  const plan2 = PLAN_CONFIGS.PLAN_2;
  if (
    plan2.interestLowerThreshold !== scraped.plan2InterestScale.lowerThreshold
  ) {
    mismatches.push({
      field: "PLAN_2.interestLowerThreshold",
      current: plan2.interestLowerThreshold,
      scraped: scraped.plan2InterestScale.lowerThreshold,
    });
  }
  if (
    plan2.interestUpperThreshold !== scraped.plan2InterestScale.upperThreshold
  ) {
    mismatches.push({
      field: "PLAN_2.interestUpperThreshold",
      current: plan2.interestUpperThreshold,
      scraped: scraped.plan2InterestScale.upperThreshold,
    });
  }

  // Current rates
  const scrapedRpi = findRpi(scraped);
  if (CURRENT_RATES.rpi !== scrapedRpi) {
    mismatches.push({
      field: "CURRENT_RATES.rpi",
      current: CURRENT_RATES.rpi,
      scraped: scrapedRpi,
    });
  }

  if (CURRENT_RATES.boeBaseRate !== scraped.boeBaseRate) {
    mismatches.push({
      field: "CURRENT_RATES.boeBaseRate",
      current: CURRENT_RATES.boeBaseRate,
      scraped: scraped.boeBaseRate,
    });
  }

  return mismatches;
}

async function main(): Promise<void> {
  // 1. Read scraped data
  const scrapedPath = path.join(resultsDir, "scraped-data.json");
  const scraped: ScrapedGovUkData = JSON.parse(
    readFileSync(scrapedPath, "utf-8"),
  );

  // 2. Fetch BoE base rate
  console.log("Fetching BoE base rate...");
  const boeBaseRate = await fetchBoeBaseRate();
  console.log(`BoE base rate: ${boeBaseRate}%`);
  scraped.boeBaseRate = boeBaseRate;

  // Write updated scraped data back
  writeFileSync(scrapedPath, JSON.stringify(scraped, null, 2) + "\n");

  // 3. Compare scraped vs current values
  const mismatches = comparePlans(scraped);

  if (mismatches.length > 0) {
    console.log(`Found ${mismatches.length} figure mismatch(es):`);
    for (const m of mismatches) {
      console.log(`  ${m.field}: current=${m.current}, scraped=${m.scraped}`);
    }
  } else {
    console.log("All figures match.");
  }

  // 4. Generate files and check for content drift (template changes, formatting, etc.)
  const lastUpdated =
    mismatches.length > 0 ? new Date().toISOString() : LAST_UPDATED;

  const filesToUpdate: { path: string; label: string; content: string }[] = [
    {
      path: path.join(projectRoot, "src/lib/loans/plans.ts"),
      label: "src/lib/loans/plans.ts",
      content: generatePlansTs(scraped, TUITION_FEE_CAP, lastUpdated),
    },
    {
      path: path.join(projectRoot, "src/lib/loans/plans.test.ts"),
      label: "src/lib/loans/plans.test.ts",
      content: generatePlansTestTs(scraped),
    },
    {
      path: path.join(projectRoot, "public/llms.txt"),
      label: "public/llms.txt",
      content: generateLlmsTxt(scraped),
    },
  ];

  const driftedFiles: string[] = [];
  for (const file of filesToUpdate) {
    const current = readFileSync(file.path, "utf-8");
    if (current !== file.content) {
      driftedFiles.push(file.label);
    }
  }

  if (mismatches.length === 0 && driftedFiles.length === 0) {
    console.log("No updates needed.");
    const result: CheckResult = {
      status: "ok",
      checkedAt: new Date().toISOString(),
    };
    writeFileSync(
      path.join(resultsDir, "check-result.json"),
      JSON.stringify(result, null, 2) + "\n",
    );
    return;
  }

  if (driftedFiles.length > 0) {
    console.log(`Found ${driftedFiles.length} file(s) with content drift:`);
    for (const f of driftedFiles) {
      console.log(`  ${f}`);
    }
  }

  // 5. Write updated files
  for (const file of filesToUpdate) {
    writeFileSync(file.path, file.content);
    console.log(`Updated ${file.label}`);
  }

  const result: CheckResult = {
    status: "mismatch",
    mismatches,
    checkedAt: new Date().toISOString(),
  };
  writeFileSync(
    path.join(resultsDir, "check-result.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log("Wrote check-result.json with mismatches.");
}

main().catch((error) => {
  console.error("Update failed:", error);
  process.exit(1);
});
