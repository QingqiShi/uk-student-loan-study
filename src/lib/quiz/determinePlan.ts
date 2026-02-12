import type { PlanType, UndergraduatePlanType } from "@/lib/loans/types";

/**
 * Start year groups for quiz selection.
 */
export type StartYearGroup = "before-2012" | "2012-2022" | "2023-or-later";

/**
 * UK regions for quiz selection.
 */
export type Region = "england" | "wales" | "scotland" | "northern-ireland";

/**
 * User's answers to the quiz questions.
 * startYearGroup is optional - only needed for England/Wales.
 */
export interface QuizAnswers {
  region: Region;
  startYearGroup?: StartYearGroup;
}

/**
 * Determines the undergraduate loan plan type based on quiz answers.
 *
 * Logic:
 * - Scotland → PLAN_4 (regardless of year)
 * - Northern Ireland → PLAN_1 (regardless of year)
 * - England/Wales before 2012 → PLAN_1
 * - England/Wales 2012-2022 → PLAN_2
 * - England/Wales 2023+ → PLAN_5
 */
export function determinePlan(answers: QuizAnswers): UndergraduatePlanType {
  const { region, startYearGroup } = answers;

  // Scottish students are always Plan 4
  if (region === "scotland") {
    return "PLAN_4";
  }

  // Northern Irish students are always Plan 1
  if (region === "northern-ireland") {
    return "PLAN_1";
  }

  // England or Wales - depends on start year
  switch (startYearGroup) {
    case "before-2012":
      return "PLAN_1";
    case "2012-2022":
      return "PLAN_2";
    case "2023-or-later":
      return "PLAN_5";
    default:
      // Default to PLAN_2 if somehow called without startYearGroup for England/Wales
      return "PLAN_2";
  }
}

/**
 * Checks if we can skip the start year question based on region.
 * Scotland and Northern Ireland don't need start year for determination.
 */
export function canSkipStartYear(region: Region): boolean {
  return region === "scotland" || region === "northern-ireland";
}

/**
 * Whether to ask about a second undergraduate course.
 * Only relevant for England/Wales students who started before 2023.
 */
export function shouldAskAboutAdditionalCourse(
  region: Region,
  yearGroup: StartYearGroup,
): boolean {
  if (region === "scotland" || region === "northern-ireland") return false;
  if (yearGroup === "2023-or-later") return false;
  return true; // before-2012 or 2012-2022 in England/Wales
}

/**
 * The plan type for the additional course, based on the original start year group.
 */
export function getAdditionalCoursePlan(
  yearGroup: StartYearGroup,
): UndergraduatePlanType {
  return yearGroup === "before-2012" ? "PLAN_2" : "PLAN_5";
}

/**
 * Quiz state used by the enhanced multi-loan quiz flow.
 */
export interface QuizState {
  currentStep: QuizStep;
  region: Region | null;
  startYearGroup: StartYearGroup | null;
  hasAdditionalCourse: boolean | null;
  postgradAnswer: "loan" | "self-funded" | "no" | null;
  direction: "forward" | "backward";
}

export type QuizStep =
  | "region"
  | "start-year"
  | "additional-course"
  | "postgrad"
  | "result";

/**
 * Determine all loan plan types from the full quiz state.
 */
export function determineAllLoans(state: QuizState): PlanType[] {
  const loans: PlanType[] = [];

  // Primary undergraduate loan
  if (state.region && state.startYearGroup) {
    loans.push(
      determinePlan({
        region: state.region,
        startYearGroup: state.startYearGroup,
      }),
    );
  } else if (state.region) {
    loans.push(determinePlan({ region: state.region }));
  }

  // Additional undergraduate course
  if (state.hasAdditionalCourse && state.startYearGroup) {
    loans.push(getAdditionalCoursePlan(state.startYearGroup));
  }

  // Postgraduate loan
  if (state.postgradAnswer === "loan") {
    loans.push("POSTGRADUATE");
  }

  return loans;
}
