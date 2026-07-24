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
 * - England 2023+ → PLAN_5
 * - Wales 2023+ → PLAN_2 (Plan 5 is England-only)
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
      // Plan 5 is England-only; Welsh students starting 2023+ remain on Plan 2
      return region === "england" ? "PLAN_5" : "PLAN_2";
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
 * The plan type for the additional course, based on the original start year
 * group and region. Plan 5 is England-only; Welsh students get Plan 2.
 */
export function getAdditionalCoursePlan(
  yearGroup: StartYearGroup,
  region: Region,
): UndergraduatePlanType {
  if (yearGroup === "before-2012") return "PLAN_2";
  // 2012-2022 starters taking a new course after Aug 2023
  return region === "england" ? "PLAN_5" : "PLAN_2";
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
  "region" | "start-year" | "additional-course" | "postgrad" | "result";

const REGION_LABELS: Record<Region, string> = {
  england: "England",
  wales: "Wales",
  scotland: "Scotland",
  "northern-ireland": "Northern Ireland",
};

const START_YEAR_LABELS: Record<StartYearGroup, string> = {
  "before-2012": "Started before 2012",
  "2012-2022": "Started 2012–2022",
  "2023-or-later": "Started 2023 or later",
};

/**
 * Whether the current answers include a *distinct* additional-course loan: the
 * user said yes AND the current region/year path still asks the question (a
 * stale "yes" from an edited-away branch doesn't count). Written once and shared
 * by the loan derivation and the recap so the two can never disagree. Typed as a
 * guard so callers get non-null `region`/`startYearGroup` narrowing.
 */
function includesAdditionalCourseLoan(
  state: QuizState,
): state is QuizState & { region: Region; startYearGroup: StartYearGroup } {
  return Boolean(
    state.hasAdditionalCourse &&
    state.region &&
    state.startYearGroup &&
    shouldAskAboutAdditionalCourse(state.region, state.startYearGroup),
  );
}

/**
 * Human-readable recap of the answers that produced a result, so the result
 * screen can show *why* a plan was matched (e.g. "England · Started 2012–2022 ·
 * Postgraduate loan") rather than an unexplained label. Only answers that were
 * actually given — and that affect the outcome — appear.
 */
export function summariseQuizAnswers(state: QuizState): string[] {
  const parts: string[] = [];
  if (state.region) parts.push(REGION_LABELS[state.region]);
  if (state.startYearGroup) parts.push(START_YEAR_LABELS[state.startYearGroup]);
  if (includesAdditionalCourseLoan(state)) parts.push("Plus a later course");
  // Only "loan" adds a postgraduate plan; self-funded/no add none, so — per this
  // function's contract — they don't appear in the recap of matched plans.
  if (state.postgradAnswer === "loan") parts.push("Postgraduate loan");
  return parts;
}

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

  // Additional undergraduate course — only when the current region/year path
  // actually asks about it (guards a stale "yes" from an edited-away branch).
  if (includesAdditionalCourseLoan(state)) {
    loans.push(getAdditionalCoursePlan(state.startYearGroup, state.region));
  }

  // Postgraduate loan
  if (state.postgradAnswer === "loan") {
    loans.push("POSTGRADUATE");
  }

  // Plan type is the loan's identity downstream (result rows key on it, and so
  // does balance setup), so collapse duplicates: e.g. a Welsh 2012–2022 student
  // with a second course maps both undergraduate loans to PLAN_2.
  return [...new Set(loans)];
}
