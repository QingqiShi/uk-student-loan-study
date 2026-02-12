"use client";

import { useReducer, useRef } from "react";
import { AdditionalCourseQuestion } from "./AdditionalCourseQuestion";
import { PostgradQuestion } from "./PostgradQuestion";
import { QuizProgress } from "./QuizProgress";
import { RegionQuestion } from "./RegionQuestion";
import { ResultScreen } from "./ResultScreen";
import { StartYearQuestion } from "./StartYearQuestion";
import type { PlanType } from "@/lib/loans/types";
import type {
  QuizState,
  QuizStep,
  StartYearGroup,
  Region,
} from "@/lib/quiz/determinePlan";
import {
  trackQuizStarted,
  trackQuizRegionSelected,
  trackQuizYearSelected,
  trackQuizBackClicked,
} from "@/lib/analytics";
import {
  canSkipStartYear,
  determineAllLoans,
  shouldAskAboutAdditionalCourse,
} from "@/lib/quiz/determinePlan";

type QuizAction =
  | { type: "SET_REGION"; payload: Region }
  | { type: "SET_START_YEAR"; payload: StartYearGroup }
  | { type: "SET_ADDITIONAL_COURSE"; payload: boolean }
  | { type: "SET_POSTGRAD"; payload: "loan" | "self-funded" | "no" }
  | { type: "GO_BACK" }
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
}

export function QuizContainer({
  onLoansDiscovered,
  onBack,
  onClose,
}: QuizContainerProps) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const hasStartedRef = useRef(false);

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
    dispatch({ type: "RESTART" });
  };

  const handleUseLoans = () => {
    if (onLoansDiscovered) {
      const planTypes = determineAllLoans(state);
      onLoansDiscovered(planTypes);
    }
  };

  const currentStepIndex = getCurrentStepIndex(state.currentStep);
  const showProgress = state.currentStep !== "result";
  const canGoBack = state.currentStep !== "region";

  const backHandler = canGoBack ? handleBack : onBack;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {showProgress && (
        <QuizProgress
          currentStep={currentStepIndex}
          totalSteps={TOTAL_STEPS}
          onBack={backHandler}
          onClose={onClose}
        />
      )}

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
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

          {state.currentStep === "additional-course" &&
            state.startYearGroup && (
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
              planTypes={determineAllLoans(state)}
              onRestart={handleRestart}
              direction={state.direction}
              onUseLoans={onLoansDiscovered ? handleUseLoans : undefined}
            />
          )}
        </div>
      </main>
    </div>
  );
}
