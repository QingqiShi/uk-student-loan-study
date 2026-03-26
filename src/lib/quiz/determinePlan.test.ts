import { describe, it, expect } from "vitest";
import {
  determinePlan,
  canSkipStartYear,
  shouldAskAboutAdditionalCourse,
  getAdditionalCoursePlan,
  determineAllLoans,
  type QuizAnswers,
  type QuizState,
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

    it("returns PLAN_2 for 2023 or later (Plan 5 is England-only)", () => {
      expect(
        determinePlan({
          region: "wales",
          startYearGroup: "2023-or-later",
        }),
      ).toBe("PLAN_2");
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

describe("shouldAskAboutAdditionalCourse", () => {
  it("returns true for England before-2012", () => {
    expect(shouldAskAboutAdditionalCourse("england", "before-2012")).toBe(true);
  });

  it("returns true for England 2012-2022", () => {
    expect(shouldAskAboutAdditionalCourse("england", "2012-2022")).toBe(true);
  });

  it("returns false for England 2023-or-later", () => {
    expect(shouldAskAboutAdditionalCourse("england", "2023-or-later")).toBe(
      false,
    );
  });

  it("returns true for Wales before-2012", () => {
    expect(shouldAskAboutAdditionalCourse("wales", "before-2012")).toBe(true);
  });

  it("returns true for Wales 2012-2022", () => {
    expect(shouldAskAboutAdditionalCourse("wales", "2012-2022")).toBe(true);
  });

  it("returns false for Wales 2023-or-later", () => {
    expect(shouldAskAboutAdditionalCourse("wales", "2023-or-later")).toBe(
      false,
    );
  });

  it("returns false for Scotland regardless of year group", () => {
    expect(shouldAskAboutAdditionalCourse("scotland", "before-2012")).toBe(
      false,
    );
    expect(shouldAskAboutAdditionalCourse("scotland", "2012-2022")).toBe(false);
    expect(shouldAskAboutAdditionalCourse("scotland", "2023-or-later")).toBe(
      false,
    );
  });

  it("returns false for Northern Ireland regardless of year group", () => {
    expect(
      shouldAskAboutAdditionalCourse("northern-ireland", "before-2012"),
    ).toBe(false);
    expect(
      shouldAskAboutAdditionalCourse("northern-ireland", "2012-2022"),
    ).toBe(false);
    expect(
      shouldAskAboutAdditionalCourse("northern-ireland", "2023-or-later"),
    ).toBe(false);
  });
});

describe("getAdditionalCoursePlan", () => {
  it("returns PLAN_2 for pre-2012 starters regardless of region", () => {
    expect(getAdditionalCoursePlan("before-2012", "england")).toBe("PLAN_2");
    expect(getAdditionalCoursePlan("before-2012", "wales")).toBe("PLAN_2");
  });

  it("returns PLAN_5 for 2012-2022 England starters", () => {
    expect(getAdditionalCoursePlan("2012-2022", "england")).toBe("PLAN_5");
  });

  it("returns PLAN_2 for 2012-2022 Wales starters (Plan 5 is England-only)", () => {
    expect(getAdditionalCoursePlan("2012-2022", "wales")).toBe("PLAN_2");
  });
});

describe("determineAllLoans", () => {
  const baseState: QuizState = {
    currentStep: "result",
    region: null,
    startYearGroup: null,
    hasAdditionalCourse: null,
    postgradAnswer: null,
    direction: "forward",
  };

  it("returns single plan for Scotland without postgrad", () => {
    const state: QuizState = {
      ...baseState,
      region: "scotland",
      postgradAnswer: "no",
    };
    expect(determineAllLoans(state)).toEqual(["PLAN_4"]);
  });

  it("returns single plan for Northern Ireland without postgrad", () => {
    const state: QuizState = {
      ...baseState,
      region: "northern-ireland",
      postgradAnswer: "no",
    };
    expect(determineAllLoans(state)).toEqual(["PLAN_1"]);
  });

  it("returns PLAN_2 for England 2012-2022 without additional course", () => {
    const state: QuizState = {
      ...baseState,
      region: "england",
      startYearGroup: "2012-2022",
      hasAdditionalCourse: false,
      postgradAnswer: "no",
    };
    expect(determineAllLoans(state)).toEqual(["PLAN_2"]);
  });

  it("returns PLAN_5 for England 2023-or-later", () => {
    const state: QuizState = {
      ...baseState,
      region: "england",
      startYearGroup: "2023-or-later",
      postgradAnswer: "no",
    };
    expect(determineAllLoans(state)).toEqual(["PLAN_5"]);
  });

  it("includes additional course plan for before-2012 with additional course", () => {
    const state: QuizState = {
      ...baseState,
      region: "england",
      startYearGroup: "before-2012",
      hasAdditionalCourse: true,
      postgradAnswer: "no",
    };
    expect(determineAllLoans(state)).toEqual(["PLAN_1", "PLAN_2"]);
  });

  it("includes additional course plan for 2012-2022 with additional course", () => {
    const state: QuizState = {
      ...baseState,
      region: "england",
      startYearGroup: "2012-2022",
      hasAdditionalCourse: true,
      postgradAnswer: "no",
    };
    expect(determineAllLoans(state)).toEqual(["PLAN_2", "PLAN_5"]);
  });

  it("includes POSTGRADUATE when postgradAnswer is loan", () => {
    const state: QuizState = {
      ...baseState,
      region: "england",
      startYearGroup: "2012-2022",
      hasAdditionalCourse: false,
      postgradAnswer: "loan",
    };
    expect(determineAllLoans(state)).toEqual(["PLAN_2", "POSTGRADUATE"]);
  });

  it("does not include POSTGRADUATE when postgradAnswer is self-funded", () => {
    const state: QuizState = {
      ...baseState,
      region: "england",
      startYearGroup: "2012-2022",
      hasAdditionalCourse: false,
      postgradAnswer: "self-funded",
    };
    expect(determineAllLoans(state)).toEqual(["PLAN_2"]);
  });

  it("returns all three loan types when applicable", () => {
    const state: QuizState = {
      ...baseState,
      region: "england",
      startYearGroup: "2012-2022",
      hasAdditionalCourse: true,
      postgradAnswer: "loan",
    };
    expect(determineAllLoans(state)).toEqual([
      "PLAN_2",
      "PLAN_5",
      "POSTGRADUATE",
    ]);
  });

  it("handles Scotland with postgrad loan", () => {
    const state: QuizState = {
      ...baseState,
      region: "scotland",
      postgradAnswer: "loan",
    };
    expect(determineAllLoans(state)).toEqual(["PLAN_4", "POSTGRADUATE"]);
  });

  it("does not add additional course for Scotland even if hasAdditionalCourse is true", () => {
    const state: QuizState = {
      ...baseState,
      region: "scotland",
      hasAdditionalCourse: true,
      postgradAnswer: "no",
    };
    // No startYearGroup means getAdditionalCoursePlan won't be called
    expect(determineAllLoans(state)).toEqual(["PLAN_4"]);
  });

  it("returns empty array when region is null", () => {
    const state: QuizState = {
      ...baseState,
      region: null,
    };
    expect(determineAllLoans(state)).toEqual([]);
  });
});
