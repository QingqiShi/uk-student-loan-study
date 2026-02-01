import { describe, it, expect } from "vitest";
import {
  determinePlan,
  canSkipStartYear,
  type QuizAnswers,
} from "./determinePlan";

describe("determinePlan", () => {
  describe("Scotland", () => {
    it("returns PLAN_4 regardless of start year", () => {
      // Scotland doesn't need startYearGroup
      expect(determinePlan({ region: "scotland" })).toBe("PLAN_4");

      // Even with startYearGroup provided, still returns PLAN_4
      const testCases: QuizAnswers[] = [
        { region: "scotland", startYearGroup: "before-2012" },
        { region: "scotland", startYearGroup: "2012-2022" },
        { region: "scotland", startYearGroup: "2023-or-later" },
      ];

      for (const answers of testCases) {
        expect(determinePlan(answers)).toBe("PLAN_4");
      }
    });
  });

  describe("Northern Ireland", () => {
    it("returns PLAN_1 regardless of start year", () => {
      // Northern Ireland doesn't need startYearGroup
      expect(determinePlan({ region: "northern-ireland" })).toBe("PLAN_1");

      // Even with startYearGroup provided, still returns PLAN_1
      const testCases: QuizAnswers[] = [
        { region: "northern-ireland", startYearGroup: "before-2012" },
        { region: "northern-ireland", startYearGroup: "2012-2022" },
        { region: "northern-ireland", startYearGroup: "2023-or-later" },
      ];

      for (const answers of testCases) {
        expect(determinePlan(answers)).toBe("PLAN_1");
      }
    });
  });

  describe("England", () => {
    it("returns PLAN_1 for before 2012", () => {
      expect(
        determinePlan({
          region: "england",
          startYearGroup: "before-2012",
        }),
      ).toBe("PLAN_1");
    });

    it("returns PLAN_2 for 2012-2022", () => {
      expect(
        determinePlan({
          region: "england",
          startYearGroup: "2012-2022",
        }),
      ).toBe("PLAN_2");
    });

    it("returns PLAN_5 for 2023 or later", () => {
      expect(
        determinePlan({
          region: "england",
          startYearGroup: "2023-or-later",
        }),
      ).toBe("PLAN_5");
    });
  });

  describe("Wales", () => {
    it("returns PLAN_1 for before 2012", () => {
      expect(
        determinePlan({
          region: "wales",
          startYearGroup: "before-2012",
        }),
      ).toBe("PLAN_1");
    });

    it("returns PLAN_2 for 2012-2022", () => {
      expect(
        determinePlan({
          region: "wales",
          startYearGroup: "2012-2022",
        }),
      ).toBe("PLAN_2");
    });

    it("returns PLAN_5 for 2023 or later", () => {
      expect(
        determinePlan({
          region: "wales",
          startYearGroup: "2023-or-later",
        }),
      ).toBe("PLAN_5");
    });
  });
});

describe("canSkipStartYear", () => {
  it("returns true for Scotland", () => {
    expect(canSkipStartYear("scotland")).toBe(true);
  });

  it("returns true for Northern Ireland", () => {
    expect(canSkipStartYear("northern-ireland")).toBe(true);
  });

  it("returns false for England", () => {
    expect(canSkipStartYear("england")).toBe(false);
  });

  it("returns false for Wales", () => {
    expect(canSkipStartYear("wales")).toBe(false);
  });
});
