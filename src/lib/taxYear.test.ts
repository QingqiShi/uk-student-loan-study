import { describe, expect, it } from "vitest";
import {
  formatTaxYearLabel,
  getCurrentTaxYearLabel,
  getCurrentTaxYearStartYear,
} from "./taxYear";

describe("getCurrentTaxYearStartYear", () => {
  it("returns the same calendar year for a mid-year date", () => {
    expect(getCurrentTaxYearStartYear(new Date("2026-07-10"))).toBe(2026);
  });

  it("treats 6 April as the start of the new tax year", () => {
    expect(getCurrentTaxYearStartYear(new Date("2026-04-06"))).toBe(2026);
  });

  it("treats 5 April as still in the previous tax year", () => {
    expect(getCurrentTaxYearStartYear(new Date("2026-04-05"))).toBe(2025);
  });

  it("treats January as the previous tax year", () => {
    expect(getCurrentTaxYearStartYear(new Date("2027-01-01"))).toBe(2026);
  });
});

describe("formatTaxYearLabel", () => {
  it("formats a typical tax year", () => {
    expect(formatTaxYearLabel(2026)).toBe("2026/27");
  });

  it("zero-pads the end year across a decade boundary", () => {
    expect(formatTaxYearLabel(2029)).toBe("2029/30");
  });

  it("zero-pads the end year across a century boundary", () => {
    expect(formatTaxYearLabel(2099)).toBe("2099/00");
  });
});

describe("getCurrentTaxYearLabel", () => {
  it("combines the start year and label formatting", () => {
    expect(getCurrentTaxYearLabel(new Date("2026-07-10"))).toBe("2026/27");
  });

  it("uses the previous tax year before 6 April", () => {
    expect(getCurrentTaxYearLabel(new Date("2026-04-05"))).toBe("2025/26");
  });
});
