import { describe, expect, it } from "vitest";
import { formatGBP, formatPercent, formatYearFromMonth } from "./format";

describe("formatGBP", () => {
  it("formats a typical balance with thousands separator", () => {
    expect(formatGBP(28470)).toBe("£28,470");
  });

  it("formats zero", () => {
    expect(formatGBP(0)).toBe("£0");
  });

  it("formats a small number without separator", () => {
    expect(formatGBP(500)).toBe("£500");
  });

  it("formats a large number with thousands separators", () => {
    expect(formatGBP(1234567)).toBe("£1,234,567");
  });

  it("formats a number at the thousands boundary", () => {
    expect(formatGBP(1000)).toBe("£1,000");
  });
});

describe("formatPercent", () => {
  it("formats a decimal percentage", () => {
    expect(formatPercent(3.2)).toBe("3.2%");
  });

  it("formats a whole number percentage", () => {
    expect(formatPercent(5)).toBe("5%");
  });

  it("formats zero", () => {
    expect(formatPercent(0)).toBe("0%");
  });
});

describe("formatYearFromMonth", () => {
  it("converts month 0 to Year 0", () => {
    expect(formatYearFromMonth(0)).toBe("Year 0");
  });

  it("converts month 12 to Year 1", () => {
    expect(formatYearFromMonth(12)).toBe("Year 1");
  });

  it("converts month 24 to Year 2", () => {
    expect(formatYearFromMonth(24)).toBe("Year 2");
  });

  it("rounds partial years", () => {
    expect(formatYearFromMonth(18)).toBe("Year 2");
    expect(formatYearFromMonth(6)).toBe("Year 1");
  });

  it("converts a large month value", () => {
    expect(formatYearFromMonth(360)).toBe("Year 30");
  });

  it("converts month 480 to Year 40", () => {
    expect(formatYearFromMonth(480)).toBe("Year 40");
  });
});
