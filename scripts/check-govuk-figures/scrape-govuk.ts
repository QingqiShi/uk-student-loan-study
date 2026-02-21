import type { Page } from "@playwright/test";

import type {
  ScrapedGovUkData,
  ScrapedInterestRate,
  ScrapedPlan2InterestScale,
  ScrapedPlanThreshold,
  ScrapedRepaymentRate,
  ScrapedWriteOff,
} from "./types";

const PLAN_NAME_MAP: Record<string, string> = {
  "plan 1": "PLAN_1",
  "plan 2": "PLAN_2",
  "plan 4": "PLAN_4",
  "plan 5": "PLAN_5",
  "postgraduate loan": "POSTGRADUATE",
  postgraduate: "POSTGRADUATE",
};

function normalizePlanName(raw: string): string {
  const lower = raw.trim().toLowerCase();
  for (const [key, value] of Object.entries(PLAN_NAME_MAP)) {
    if (lower.includes(key)) return value;
  }
  throw new Error(`Unknown plan name: "${raw}"`);
}

/**
 * Extract all plan identifiers from text like "Plan 1, 2, 4 or 5"
 * or "Postgraduate Loan plan".
 */
function extractPlansFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const plans: string[] = [];

  // Check for postgraduate first
  if (lower.includes("postgraduate")) {
    plans.push("POSTGRADUATE");
  }

  // Match "Plan N" patterns and also bare numbers in sequences like "Plan 1, 2, 4 or 5"
  const planSequence = lower.match(/plan\s+(\d(?:\s*[,or and]+\s*\d)*)/);
  if (planSequence) {
    const nums = planSequence[0].match(/\d/g);
    if (nums) {
      for (const n of nums) {
        const key = `PLAN_${n}`;
        if (!plans.includes(key)) plans.push(key);
      }
    }
  }

  return plans;
}

function parseCurrency(text: string): number {
  const match = text.match(/£([\d,]+)/);
  if (!match) throw new Error(`Could not parse currency from: "${text}"`);
  return Number(match[1].replace(/,/g, ""));
}

function parsePercentage(text: string): number {
  const match = text.match(/([\d.]+)%/);
  if (!match) throw new Error(`Could not parse percentage from: "${text}"`);
  return Number(match[1]);
}

async function scrapeThresholds(page: Page): Promise<{
  thresholds: ScrapedPlanThreshold[];
  plan2InterestScale: ScrapedPlan2InterestScale;
}> {
  // Find the first table with "Plan type" header — threshold table
  const thresholdRows = await page.$$eval("table", (tables) => {
    const table = tables.find((t) => {
      const headerText =
        t.querySelector("thead, tr:first-child")?.textContent ?? "";
      return headerText.toLowerCase().includes("plan type");
    });
    if (!table)
      throw new Error("Could not find threshold table with 'Plan type' header");
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    return rows.map((row) => {
      const cells = Array.from(row.querySelectorAll("td, th"));
      return cells.map((cell) => cell.textContent?.trim() ?? "");
    });
  });

  // Table columns: Plan type | Yearly threshold | Monthly threshold | Weekly threshold
  const thresholds: ScrapedPlanThreshold[] = thresholdRows.map((cells) => {
    if (cells.length < 3) {
      throw new Error(
        `Threshold row has unexpected cell count: ${cells.length}`,
      );
    }
    const planName = normalizePlanName(cells[0]);
    const yearlyThreshold = parseCurrency(cells[1]);
    const monthlyThreshold = parseCurrency(cells[2]);
    return {
      plan: planName,
      monthlyThreshold,
      yearlyThreshold,
    };
  });

  if (thresholds.length !== 5) {
    throw new Error(`Expected 5 threshold rows, got ${thresholds.length}`);
  }

  // Find the second table — Plan 2 interest scale
  const plan2Rows = await page.$$eval("table", (tables) => {
    // The second table is the income-based interest table
    const interestTables = tables.filter((t) => {
      const headerText =
        t.querySelector("thead, tr:first-child")?.textContent ?? "";
      return !headerText.toLowerCase().includes("plan type");
    });
    if (interestTables.length === 0) {
      throw new Error("Could not find Plan 2 interest scale table");
    }
    const table = interestTables[0];
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    return rows.map((row) => {
      const cells = Array.from(row.querySelectorAll("td, th"));
      return cells.map((cell) => cell.textContent?.trim() ?? "");
    });
  });

  // Parse the interest scale thresholds from table rows
  let lowerThreshold = 0;
  let upperThreshold = 0;

  for (const cells of plan2Rows) {
    const text = cells.join(" ");
    // Look for row with lower threshold (e.g., "£28,470 or less")
    if (text.toLowerCase().includes("or less")) {
      const match = text.match(/£([\d,]+)/);
      if (match) lowerThreshold = Number(match[1].replace(/,/g, ""));
    }
    // Look for row with upper threshold (e.g., "£51,245 or more")
    if (text.toLowerCase().includes("or more")) {
      const match = text.match(/£([\d,]+)/);
      if (match) upperThreshold = Number(match[1].replace(/,/g, ""));
    }
  }

  if (lowerThreshold === 0 || upperThreshold === 0) {
    throw new Error(
      `Could not extract Plan 2 interest scale thresholds. Lower: ${lowerThreshold}, Upper: ${upperThreshold}`,
    );
  }

  const plan2InterestScale: ScrapedPlan2InterestScale = {
    lowerThreshold,
    upperThreshold,
  };

  return { thresholds, plan2InterestScale };
}

async function scrapeRepaymentRates(
  page: Page,
): Promise<ScrapedRepaymentRate[]> {
  const listItems = await page.$$eval("li", (items) =>
    items
      .filter((li) =>
        (li.textContent ?? "").includes("of your income over the threshold"),
      )
      .map((li) => li.textContent?.trim() ?? ""),
  );

  const rates: ScrapedRepaymentRate[] = listItems.map((text) => {
    const rate = parseFloat(text.match(/([\d.]+)%/)?.[1] ?? "");
    if (isNaN(rate))
      throw new Error(`Could not parse repayment rate from: "${text}"`);
    const plans = extractPlansFromText(text);
    return { plans, rate };
  });

  if (rates.length === 0) {
    throw new Error("Could not find any repayment rate entries");
  }

  return rates;
}

async function scrapeInterestRates(page: Page): Promise<ScrapedInterestRate[]> {
  // Interest rate list items follow patterns like "3.2% if you\u2019re on Plan 1"
  // GOV.UK uses curly apostrophes (\u2019), so we normalize to straight quotes before matching
  const listItems = await page.$$eval("li", (items) =>
    items
      .filter((li) => {
        const text = (li.textContent ?? "")
          .toLowerCase()
          .replace(/\u2019/g, "'");
        return (
          text.includes("%") &&
          !text.includes("of your income") &&
          (text.includes("if you're on plan") ||
            text.includes("if you're on a postgraduate"))
        );
      })
      .map((li) => li.textContent?.trim() ?? ""),
  );

  const rates: ScrapedInterestRate[] = listItems.map((text) => {
    const rateMatch = text.match(/([\d.]+)%/);
    const rate = rateMatch ? parseFloat(rateMatch[1]) : 0;
    const plans = extractPlansFromText(text);
    return { plans, rate, description: text };
  });

  return rates;
}

async function scrapeWriteOffs(page: Page): Promise<ScrapedWriteOff[]> {
  await page.goto(
    "https://www.gov.uk/repaying-your-student-loan/when-your-student-loan-gets-written-off-or-cancelled",
    {
      waitUntil: "domcontentloaded",
    },
  );

  // Extract write-off years from paragraph text containing "years after"
  const writeOffs: ScrapedWriteOff[] = await page.$$eval(
    "h2, h3, p, li",
    (elements) => {
      const results: { plan: string; years: number }[] = [];
      let currentPlanSection = "";

      const planSectionMap: Record<string, string> = {
        "plan 1": "PLAN_1",
        "plan 2": "PLAN_2",
        "plan 4": "PLAN_4",
        "plan 5": "PLAN_5",
        postgraduate: "POSTGRADUATE",
      };

      for (const el of elements) {
        const text = (el.textContent ?? "").trim().toLowerCase();

        if (el.tagName === "H2" || el.tagName === "H3") {
          for (const [key, value] of Object.entries(planSectionMap)) {
            if (text.includes(key)) {
              currentPlanSection = value;
              break;
            }
          }
        }

        if ((el.tagName === "P" || el.tagName === "LI") && currentPlanSection) {
          const yearMatch = text.match(/(\d+)\s*years?\s*after/);
          if (yearMatch) {
            results.push({
              plan: currentPlanSection,
              years: parseInt(yearMatch[1], 10),
            });
            currentPlanSection = ""; // Reset to avoid duplicate captures
          }
        }
      }

      return results;
    },
  );

  if (writeOffs.length !== 5) {
    throw new Error(`Expected 5 write-off entries, got ${writeOffs.length}`);
  }

  return writeOffs;
}

export async function scrapeGovUk(page: Page): Promise<ScrapedGovUkData> {
  // Page 1: Thresholds, rates, and interest
  await page.goto(
    "https://www.gov.uk/repaying-your-student-loan/what-you-pay",
    {
      waitUntil: "domcontentloaded",
    },
  );

  const { thresholds, plan2InterestScale } = await scrapeThresholds(page);
  const repaymentRates = await scrapeRepaymentRates(page);
  const interestRates = await scrapeInterestRates(page);

  // Page 2: Write-off periods
  const writeOffs = await scrapeWriteOffs(page);

  return {
    thresholds,
    repaymentRates,
    interestRates,
    plan2InterestScale,
    writeOffs,
    boeBaseRate: 0, // Filled in later by the updater agent via fetch()
    cpi: 0, // Filled in later by the updater agent via fetch()
    scrapedAt: new Date().toISOString(),
  };
}
