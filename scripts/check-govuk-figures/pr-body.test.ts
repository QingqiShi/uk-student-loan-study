import { describe, expect, it } from "vitest";

import { formatFieldValue, renderPrBody } from "./pr-body";

describe("formatFieldValue", () => {
  it("formats a whole repayment rate without float noise", () => {
    // 0.09 * 100 is 9.000000000000002 in float; the rounding must hide that.
    expect(formatFieldValue("PLAN_2.repaymentRate", 0.09)).toBe("9%");
  });

  it("preserves a sub-point repayment-rate change", () => {
    expect(formatFieldValue("PLAN_2.repaymentRate", 0.086)).toBe("8.6%");
  });

  it("formats a market rate as a percent", () => {
    expect(formatFieldValue("CURRENT_RATES.rpi", 3.2)).toBe("3.2%");
  });

  it("formats a threshold as pounds with separators", () => {
    expect(formatFieldValue("PLAN_2.monthlyThreshold", 2448)).toBe("£2,448");
  });

  it("formats a write-off period in years", () => {
    expect(formatFieldValue("PLAN_5.writeOffYears", 40)).toBe("40 years");
  });
});

describe("renderPrBody", () => {
  it("announces auto-merge and lists formatted changes with sources", () => {
    const body = renderPrBody(
      "mismatch-auto",
      [{ field: "CURRENT_RATES.rpi", current: 3.2, scraped: 4.1 }],
      undefined,
    );
    expect(body).toContain("merges automatically");
    expect(body).toContain("CURRENT_RATES.rpi: 3.2% → 4.1%");
    expect(body).toContain("gov.uk/repaying-your-student-loan");
  });

  it("lists review reasons and a checklist for a review change", () => {
    const body = renderPrBody(
      "mismatch-review",
      [{ field: "PLAN_2.monthlyThreshold", current: 2274, scraped: 2200 }],
      ["PLAN_2.monthlyThreshold: decreased from 2274 to 2200"],
    );
    expect(body).toContain("needs a human");
    expect(body).toContain("Review checklist");
    expect(body).toContain("decreased from 2274 to 2200");
    expect(body).toContain("PLAN_2.monthlyThreshold: £2,274 → £2,200");
  });

  it("handles a drift-only change with no figure move", () => {
    const body = renderPrBody(
      "mismatch-review",
      [],
      ["content or template drift with no figure change"],
    );
    expect(body).toContain("no figure value moved");
  });
});
