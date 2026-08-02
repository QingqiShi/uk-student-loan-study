"use client";

import { useEffect, useReducer, useRef } from "react";
import {
  trackQuizStarted,
  trackQuizRegionSelected,
  trackQuizYearSelected,
  trackQuizBackClicked,
  trackQuizCompleted,
} from "@/lib/analytics";
import type { PlanType } from "@/lib/loans/types";
import type {
  QuizState,
  QuizStep,
  StartYearGroup,
  Region,
} from "@/lib/quiz/determinePlan";
import {
  canSkipStartYear,
  determineAllLoans,
  shouldAskAboutAdditionalCourse,
  summariseQuizAnswers,
} from "@/lib/quiz/determinePlan";
import { surfaceCard } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { AdditionalCourseQuestion } from "./AdditionalCourseQuestion";
import { PostgradQuestion } from "./PostgradQuestion";
import { QuizProgress } from "./QuizProgress";
import { RegionQuestion } from "./RegionQuestion";
import { ResultScreen } from "./ResultScreen";
import { StartYearQuestion } from "./StartYearQuestion";

type QuizAction =
  | { type: "SET_REGION"; payload: Region }
  | { type: "SET_START_YEAR"; payload: StartYearGroup }
  | { type: "SET_ADDITIONAL_COURSE"; payload: boolean }
  | { type: "SET_POSTGRAD"; payload: "loan" | "self-funded" | "no" }
  | { type: "GO_BACK" }
  | { type: "EDIT_ANSWERS" }
  | { type: "RESTART" };

const initialState: QuizState = {
  currentStep: "region",
  region: null,
  startYearGroup: null,
  hasAdditionalCourse: null,
  postgradAnswer: null,
  direction: "forward",
};

function getNextStepAfterYear(
  region: Region,
  yearGroup: StartYearGroup,
): QuizStep {
  if (shouldAskAboutAdditionalCourse(region, yearGroup)) {
    return "additional-course";
  }
  return "postgrad";
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SET_REGION": {
      const region = action.payload;
      if (canSkipStartYear(region)) {
        // Scotland/NI → skip year, go to postgrad
        return {
          ...state,
          region,
          startYearGroup: null,
          hasAdditionalCourse: null,
          currentStep: "postgrad",
          direction: "forward",
        };
      }
      return {
        ...state,
        region,
        currentStep: "start-year",
        direction: "forward",
      };
    }
    case "SET_START_YEAR": {
      const yearGroup = action.payload;
      // region is guaranteed non-null — you can't reach start-year without selecting a region
      const nextStep = state.region
        ? getNextStepAfterYear(state.region, yearGroup)
        : ("postgrad" as QuizStep);
      // Preserve hasAdditionalCourse even when the new path skips that step:
      // determineAllLoans/summariseQuizAnswers already gate it behind
      // shouldAskAboutAdditionalCourse (via includesAdditionalCourseLoan), so a
      // stale "yes" can't leak a phantom loan into the result — and keeping it
      // means editing the year back restores the earlier answer, as the edit
      // flow promises.
      return {
        ...state,
        startYearGroup: yearGroup,
        currentStep: nextStep,
        direction: "forward",
      };
    }
    case "SET_ADDITIONAL_COURSE":
      return {
        ...state,
        hasAdditionalCourse: action.payload,
        currentStep: "postgrad",
        direction: "forward",
      };
    case "SET_POSTGRAD":
      return {
        ...state,
        postgradAnswer: action.payload,
        currentStep: "result",
        direction: "forward",
      };
    case "GO_BACK": {
      switch (state.currentStep) {
        case "start-year":
          return { ...state, currentStep: "region", direction: "backward" };
        case "additional-course":
          return { ...state, currentStep: "start-year", direction: "backward" };
        case "postgrad": {
          // If we came via additional-course, go back there
          if (
            state.region &&
            state.startYearGroup &&
            shouldAskAboutAdditionalCourse(state.region, state.startYearGroup)
          ) {
            return {
              ...state,
              currentStep: "additional-course",
              direction: "backward",
            };
          }
          // If we came via start-year (2023+)
          if (state.startYearGroup) {
            return {
              ...state,
              currentStep: "start-year",
              direction: "backward",
            };
          }
          // Scotland/NI — go back to region
          return { ...state, currentStep: "region", direction: "backward" };
        }
        case "result":
          return { ...state, currentStep: "postgrad", direction: "backward" };
        default:
          return state;
      }
    }
    case "EDIT_ANSWERS":
      // Re-enter the quiz from the first question with every answer preserved,
      // so the result's "Change your answers" honestly lets the user revise any
      // of them (the flow has no per-answer jump). Reverse-slide like a back step.
      return { ...state, currentStep: "region", direction: "backward" };
    case "RESTART":
      return initialState;
    default:
      return state;
  }
}

/**
 * Always 4 steps with fixed positions so the indicator never grows mid-quiz.
 * Skipped steps just cause the bar to jump forward.
 *
 *   region(0) → start-year(1) → additional-course(2) → postgrad(3)
 */
const TOTAL_STEPS = 4;

function getCurrentStepIndex(step: QuizStep): number {
  switch (step) {
    case "region":
      return 0;
    case "start-year":
      return 1;
    case "additional-course":
      return 2;
    case "postgrad":
      return 3;
    default:
      return TOTAL_STEPS;
  }
}

interface QuizContainerProps {
  /** When provided, quiz calls this instead of showing a link to home page */
  onLoansDiscovered?: (planTypes: PlanType[]) => void;
  /** When provided, shows a back button on first step to return to caller */
  onBack?: () => void;
  /** When provided, shows a close button to exit the quiz from any step */
  onClose?: () => void;
  /**
   * Rendered inline on the /which-plan page (below the page hero) rather than
   * filling a modal: the quiz flows in its parent column with no full-height
   * centering void, the progress rail renders flush to that column instead of
   * as full-width chrome, and the masthead is the sticky element.
   */
  standalone?: boolean;
}

export function QuizContainer({
  onLoansDiscovered,
  onBack,
  onClose,
  standalone = false,
}: QuizContainerProps) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const hasStartedRef = useRef(false);

  // The loans the current answers resolve to — derived once and shared by the
  // completion effect, the result render, and the "use these loans" handler.
  const currentLoans = determineAllLoans(state);

  // Accessibility: on every step change (but not the initial mount), move focus
  // to the new step's heading. Without this, selecting an option unmounts the
  // current step and focus falls back to <body>, stranding keyboard/SR users at
  // the top of the document; landing on the heading also makes the screen reader
  // announce the new question or result. Plain focus() (no preventScroll) lets
  // the browser bring the heading into view when it's scrolled off — important on
  // the standalone page, where the card can sit below the fold.
  const stepRegionRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef<QuizStep | null>(null);
  useEffect(() => {
    const prev = prevStepRef.current;
    prevStepRef.current = state.currentStep;
    // Focus only on a real step transition — not the initial mount, and not
    // StrictMode's dev-only setup→cleanup→setup remount (same step both times),
    // which would otherwise focus and scroll to the first question on load.
    if (prev === null || prev === state.currentStep) return;
    stepRegionRef.current
      ?.querySelector<HTMLElement>("[data-step-heading]")
      ?.focus();
  }, [state.currentStep]);

  // Record a completion whenever the reached result differs from the one last
  // recorded. A no-op "Change your answers" round-trip that lands on the same
  // plans doesn't re-count; an edit that changes the outcome records the
  // corrected plans, so the latest event is always the user's final result.
  // Toggling between two outcomes re-reports each change — deliberately keeping
  // attribution correct at the cost of a little over-counting; restart re-arms.
  const lastCompletedRef = useRef<string | null>(null);
  useEffect(() => {
    if (state.currentStep !== "result") return;
    const result = currentLoans.join(",");
    if (lastCompletedRef.current !== result) {
      lastCompletedRef.current = result;
      trackQuizCompleted(result);
    }
  }, [state.currentStep, currentLoans]);

  const handleRegionSelect = (region: Region) => {
    if (!hasStartedRef.current) {
      trackQuizStarted();
      hasStartedRef.current = true;
    }
    trackQuizRegionSelected(region);
    dispatch({ type: "SET_REGION", payload: region });
  };

  const handleStartYearSelect = (yearGroup: StartYearGroup) => {
    trackQuizYearSelected(yearGroup);
    dispatch({ type: "SET_START_YEAR", payload: yearGroup });
  };

  const handleAdditionalCourseSelect = (hasAdditionalCourse: boolean) => {
    dispatch({ type: "SET_ADDITIONAL_COURSE", payload: hasAdditionalCourse });
  };

  const handlePostgradSelect = (answer: "loan" | "self-funded" | "no") => {
    dispatch({ type: "SET_POSTGRAD", payload: answer });
  };

  const handleBack = () => {
    trackQuizBackClicked(currentStepIndex);
    dispatch({ type: "GO_BACK" });
  };

  const handleRestart = () => {
    hasStartedRef.current = false;
    lastCompletedRef.current = null;
    dispatch({ type: "RESTART" });
  };

  // Distinct from the progress back-arrow: this rewinds all the way to the first
  // question (keeping answers) rather than one step, and it must not emit the
  // step-scoped quiz_back_clicked event (the result has no valid step index).
  const handleEditAnswers = () => {
    dispatch({ type: "EDIT_ANSWERS" });
  };

  const handleUseLoans = () => {
    if (onLoansDiscovered) {
      onLoansDiscovered(currentLoans);
    }
  };

  const currentStepIndex = getCurrentStepIndex(state.currentStep);
  const showProgress = state.currentStep !== "result";
  const canGoBack = state.currentStep !== "region";

  const backHandler = canGoBack ? handleBack : onBack;

  const progress = showProgress ? (
    <QuizProgress
      currentStep={currentStepIndex}
      totalSteps={TOTAL_STEPS}
      onBack={backHandler}
      onClose={onClose}
      sticky={!standalone}
      flush={standalone}
    />
  ) : null;

  const stepContent = (
    <>
      {state.currentStep === "region" && (
        <RegionQuestion
          onSelect={handleRegionSelect}
          selectedValue={state.region}
          direction={state.direction}
        />
      )}

      {state.currentStep === "start-year" && (
        <StartYearQuestion
          onSelect={handleStartYearSelect}
          selectedValue={state.startYearGroup}
          direction={state.direction}
        />
      )}

      {state.currentStep === "additional-course" && state.startYearGroup && (
        <AdditionalCourseQuestion
          onSelect={handleAdditionalCourseSelect}
          selectedValue={state.hasAdditionalCourse}
          direction={state.direction}
          yearGroup={state.startYearGroup}
        />
      )}

      {state.currentStep === "postgrad" && (
        <PostgradQuestion
          onSelect={handlePostgradSelect}
          selectedValue={state.postgradAnswer}
          direction={state.direction}
        />
      )}

      {state.currentStep === "result" && state.region && (
        <ResultScreen
          planTypes={currentLoans}
          recap={summariseQuizAnswers(state)}
          onRestart={handleRestart}
          onEditAnswers={handleEditAnswers}
          onUseLoans={onLoansDiscovered ? handleUseLoans : undefined}
        />
      )}
    </>
  );

  // Standalone: the quiz is a single anchored instrument — one card holds the
  // progress rail (a header seam) and the active step, so the whole thing reads
  // as one focal object with clear internal hierarchy instead of a stack of
  // free-floating elements.
  if (standalone) {
    return (
      <div className={cn(surfaceCard, "overflow-hidden")}>
        {progress && (
          <div className="border-b border-border px-5 sm:px-7">{progress}</div>
        )}
        <div ref={stepRegionRef} className="px-5 py-8 sm:px-7 sm:py-10">
          {stepContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {progress}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div ref={stepRegionRef} className="w-full max-w-lg">
          {stepContent}
        </div>
      </div>
    </div>
  );
}
