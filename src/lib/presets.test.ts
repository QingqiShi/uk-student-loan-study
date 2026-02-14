import { describe, expect, it } from "vitest";
import { isPresetConfig, PRESETS } from "./presets";
import type { Loan } from "@/lib/loans/types";

describe("isPresetConfig", () => {
  it("returns true for each preset's loan config", () => {
    for (const preset of PRESETS) {
      expect(isPresetConfig(preset.loans)).toBe(true);
    }
  });

  it("returns false for a custom loan config", () => {
    const customLoans: Loan[] = [{ planType: "PLAN_2", balance: 30_000 }];
    expect(isPresetConfig(customLoans)).toBe(false);
  });

  it("returns false for an empty loans array", () => {
    expect(isPresetConfig([])).toBe(false);
  });

  it("returns false when plan types match but balances differ", () => {
    const loans: Loan[] = [{ planType: "PLAN_2", balance: 99_999 }];
    expect(isPresetConfig(loans)).toBe(false);
  });

  it("returns false when balances match but plan types differ", () => {
    const loans: Loan[] = [{ planType: "PLAN_1", balance: 45_000 }];
    expect(isPresetConfig(loans)).toBe(false);
  });

  it("returns false when loan count differs from all presets", () => {
    const loans: Loan[] = [
      { planType: "PLAN_2", balance: 45_000 },
      { planType: "POSTGRADUATE", balance: 12_000 },
      { planType: "PLAN_1", balance: 20_000 },
    ];
    expect(isPresetConfig(loans)).toBe(false);
  });
});
