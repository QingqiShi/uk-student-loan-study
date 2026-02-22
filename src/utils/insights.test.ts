import { describe, it, expect } from "vitest";
import { generateInsight } from "./insights";
import type { Loan } from "@/lib/loans/types";

const plan2Loan: Loan = { planType: "PLAN_2", balance: 50_000 };

describe("generateInsight", () => {
  it("returns null for zero balance", () => {
    const result = generateInsight(45_000, {
      loans: [{ planType: "PLAN_2", balance: 0 }],
    });
    expect(result).toBeNull();
  });

  it("returns null for empty loans array", () => {
    const result = generateInsight(45_000, { loans: [] });
    expect(result).toBeNull();
  });

  it("classifies middle-earner in peak repayment zone", () => {
    const result = generateInsight(60_000, { loans: [plan2Loan] });
    expect(result).not.toBeNull();
    expect(result?.type).toBe("middle-earner");
    expect(result?.title).toContain("peak repayment zone");
    expect(result?.description).toContain("in total");
  });

  it("classifies low-earner whose loan gets written off", () => {
    const result = generateInsight(22_000, { loans: [plan2Loan] });
    expect(result).not.toBeNull();
    expect(result?.type).toBe("low-earner");
    expect(result?.title).toContain("written off");
  });

  it("classifies high-earner who pays off quickly", () => {
    const result = generateInsight(100_000, {
      loans: [{ planType: "PLAN_2", balance: 20_000 }],
    });
    expect(result).not.toBeNull();
    expect(result?.type).toBe("high-earner");
    expect(result?.title).toContain("pay off quickly");
  });

  it("uses custom rpiRate and boeBaseRate when provided", () => {
    const withDefaults = generateInsight(60_000, { loans: [plan2Loan] });
    const withCustomRates = generateInsight(60_000, {
      loans: [plan2Loan],
      rpiRate: 0.1,
      boeBaseRate: 0.08,
    });

    expect(withDefaults).not.toBeNull();
    expect(withCustomRates).not.toBeNull();
    // With much higher rates, the description should differ
    expect(withCustomRates?.description).not.toBe(withDefaults?.description);
  });

  it("shows lower figures when discountRate is applied", () => {
    const nominal = generateInsight(60_000, { loans: [plan2Loan] });
    const pvAdjusted = generateInsight(60_000, {
      loans: [plan2Loan],
      discountRate: 0.05,
    });

    expect(nominal).not.toBeNull();
    expect(pvAdjusted).not.toBeNull();
    // Both should be middle-earner (zone classification unchanged)
    expect(nominal?.type).toBe("middle-earner");
    expect(pvAdjusted?.type).toBe("middle-earner");
    // PV-adjusted total should be lower — extract the GBP amount from description
    const extractAmount = (desc: string) => {
      const match = desc.match(/£([\d,]+)/);
      return match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;
    };
    const nominalAmount = extractAmount(nominal?.description ?? "");
    const pvAmount = extractAmount(pvAdjusted?.description ?? "");
    expect(pvAmount).toBeLessThan(nominalAmount);
  });

  it("zone classification is unchanged by discountRate", () => {
    const nominal = generateInsight(60_000, { loans: [plan2Loan] });
    const pvAdjusted = generateInsight(60_000, {
      loans: [plan2Loan],
      discountRate: 0.1,
    });

    expect(nominal?.type).toBe(pvAdjusted?.type);
  });

  it("discountRate of 0 behaves as no discount", () => {
    const noDiscount = generateInsight(60_000, { loans: [plan2Loan] });
    const zeroDiscount = generateInsight(60_000, {
      loans: [plan2Loan],
      discountRate: 0,
    });

    expect(noDiscount?.description).toBe(zeroDiscount?.description);
  });

  it("handles high-earner with negative displayOverpaymentRatio under PV", () => {
    const result = generateInsight(120_000, {
      loans: [{ planType: "PLAN_2", balance: 30_000 }],
      discountRate: 0.15,
    });

    expect(result).not.toBeNull();
    expect(result?.type).toBe("high-earner");
    expect(result?.description).toContain("less in today's money");
  });

  it("low-earner PV adjustment reduces paid percentage", () => {
    const nominal = generateInsight(35_000, { loans: [plan2Loan] });
    const pvAdjusted = generateInsight(35_000, {
      loans: [plan2Loan],
      discountRate: 0.05,
    });

    expect(nominal?.type).toBe("low-earner");
    expect(pvAdjusted?.type).toBe("low-earner");
    // PV should show lower percentage
    const extractPercent = (desc: string) => {
      const match = desc.match(/(\d+)%/);
      return match ? parseInt(match[1], 10) : 0;
    };
    const nominalPercent = extractPercent(nominal?.description ?? "");
    const pvPercent = extractPercent(pvAdjusted?.description ?? "");
    expect(pvPercent).toBeLessThanOrEqual(nominalPercent);
  });
});
