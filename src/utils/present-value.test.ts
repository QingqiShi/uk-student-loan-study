import { describe, it, expect } from "vitest";
import { toPresent, pvTotal } from "./present-value";

describe("toPresent", () => {
  it("returns nominal value when discount rate is 0", () => {
    expect(toPresent(1000, 0, 120)).toBe(1000);
  });

  it("returns nominal value when month is 0", () => {
    expect(toPresent(1000, 0.05, 0)).toBe(1000);
  });

  it("discounts a value at 2% over 12 months (1 year)", () => {
    // 1000 / (1.02)^1 ≈ 980.39
    const result = toPresent(1000, 0.02, 12);
    expect(result).toBeCloseTo(980.39, 1);
  });

  it("discounts a value at 5% over 60 months (5 years)", () => {
    // 1000 / (1.05)^5 ≈ 783.53
    const result = toPresent(1000, 0.05, 60);
    expect(result).toBeCloseTo(783.53, 1);
  });

  it("discounts at sub-year intervals correctly", () => {
    // 1000 / (1.02)^(6/12) = 1000 / (1.02)^0.5 ≈ 990.10
    const result = toPresent(1000, 0.02, 6);
    expect(result).toBeCloseTo(990.1, 1);
  });

  it("always returns less than nominal for positive rate and month > 0", () => {
    const result = toPresent(5000, 0.03, 24);
    expect(result).toBeLessThan(5000);
    expect(result).toBeGreaterThan(0);
  });
});

describe("pvTotal", () => {
  it("returns 0 for empty payments array", () => {
    expect(pvTotal([], 0.02)).toBe(0);
  });

  it("returns sum of nominal values when discount rate is 0", () => {
    const payments = [
      { month: 0, amount: 100 },
      { month: 12, amount: 100 },
      { month: 24, amount: 100 },
    ];
    expect(pvTotal(payments, 0)).toBe(300);
  });

  it("returns less than nominal total with positive discount rate", () => {
    const payments = [
      { month: 0, amount: 100 },
      { month: 12, amount: 100 },
      { month: 24, amount: 100 },
    ];
    const pv = pvTotal(payments, 0.02);
    expect(pv).toBeLessThan(300);
    // month=0 contributes exactly 100, so total > 200
    expect(pv).toBeGreaterThan(200);
  });

  it("discounts each payment individually", () => {
    const payments = [
      { month: 12, amount: 1000 },
      { month: 24, amount: 1000 },
    ];
    const total = pvTotal(payments, 0.05);
    const expected = toPresent(1000, 0.05, 12) + toPresent(1000, 0.05, 24);
    expect(total).toBeCloseTo(expected, 10);
  });
});
