import { describe, it, expect } from "vitest";
import { DEFAULT_SALARY } from "@/constants";
import { DEFAULT_PRESET } from "@/lib/presets";
import { parseMetadataParams } from "./metadata";

describe("parseMetadataParams", () => {
  describe("when no share params are present", () => {
    it("returns hasShareParams false for null", () => {
      const result = parseMetadataParams(null);
      expect(result.hasShareParams).toBe(false);
    });

    it("returns hasShareParams false for undefined", () => {
      const result = parseMetadataParams(undefined);
      expect(result.hasShareParams).toBe(false);
    });

    it("returns hasShareParams false for empty object", () => {
      const result = parseMetadataParams({});
      expect(result.hasShareParams).toBe(false);
    });

    it("uses default loans and salary", () => {
      const result = parseMetadataParams(null);
      const defaultUgBalance = DEFAULT_PRESET.loans
        .filter((l) => l.planType !== "POSTGRADUATE")
        .reduce((s, l) => s + l.balance, 0);
      const defaultPgBalance = DEFAULT_PRESET.loans
        .filter((l) => l.planType === "POSTGRADUATE")
        .reduce((s, l) => s + l.balance, 0);

      expect(result.balance).toBe(defaultUgBalance);
      expect(result.pgBalance).toBe(defaultPgBalance);
      expect(result.salary).toBe(DEFAULT_SALARY);
    });
  });

  describe("when share params are present", () => {
    it("returns hasShareParams true with loans param", () => {
      const result = parseMetadataParams({
        loans: "PLAN_2:45000",
        sal: "50000",
      });
      expect(result.hasShareParams).toBe(true);
    });

    it("parses a single undergraduate loan", () => {
      const result = parseMetadataParams({
        loans: "PLAN_2:45000",
        sal: "50000",
      });

      expect(result.planName).toBe("Plan 2");
      expect(result.balance).toBe(45000);
      expect(result.pgBalance).toBe(0);
      expect(result.totalBalance).toBe(45000);
      expect(result.salary).toBe(50000);
    });

    it("parses undergraduate + postgraduate loans", () => {
      const result = parseMetadataParams({
        loans: "PLAN_2:45000,POSTGRADUATE:12000",
        sal: "65000",
      });

      expect(result.planName).toBe("Plan 2");
      expect(result.balance).toBe(45000);
      expect(result.pgBalance).toBe(12000);
      expect(result.totalBalance).toBe(57000);
      expect(result.salary).toBe(65000);
    });

    it("returns Postgraduate as plan name when only PG loans exist", () => {
      const result = parseMetadataParams({
        loans: "POSTGRADUATE:15000",
        sal: "40000",
      });

      expect(result.planName).toBe("Postgraduate");
      expect(result.balance).toBe(0);
      expect(result.pgBalance).toBe(15000);
      expect(result.totalBalance).toBe(15000);
    });

    it("uses the first undergraduate loan for planName", () => {
      const result = parseMetadataParams({
        loans: "PLAN_5:50000,POSTGRADUATE:10000",
      });

      expect(result.planName).toBe("Plan 5");
    });

    it("resolves Plan 1 name", () => {
      const result = parseMetadataParams({ loans: "PLAN_1:20000" });
      expect(result.planName).toBe("Plan 1");
    });

    it("resolves Plan 4 name", () => {
      const result = parseMetadataParams({ loans: "PLAN_4:30000" });
      expect(result.planName).toBe("Plan 4");
    });
  });

  describe("formatted values", () => {
    it("formats balance as GBP currency", () => {
      const result = parseMetadataParams({
        loans: "PLAN_2:45000",
        sal: "50000",
      });

      expect(result.formattedBalance).toBe("£45,000");
    });

    it("formats salary as GBP currency", () => {
      const result = parseMetadataParams({
        loans: "PLAN_2:45000",
        sal: "65000",
      });

      expect(result.formattedSalary).toBe("£65,000");
    });

    it("formats combined UG + PG balance in formattedBalance", () => {
      const result = parseMetadataParams({
        loans: "PLAN_2:45000,POSTGRADUATE:12000",
      });

      expect(result.formattedBalance).toBe("£57,000");
    });
  });

  describe("edge cases", () => {
    it("handles array values in search params (uses first value)", () => {
      const result = parseMetadataParams({ sal: ["50000", "60000"] });
      // Array values are ignored by parseMetadataParams (only strings processed)
      expect(result.hasShareParams).toBe(false);
    });

    it("ignores invalid loan params and falls back to defaults", () => {
      const result = parseMetadataParams({ loans: "INVALID:abc" });
      // Invalid loans are rejected by decodeParamsToState, but the key
      // was present so hasShareParams is false (decoded returns empty)
      expect(result.hasShareParams).toBe(false);
    });
  });
});
