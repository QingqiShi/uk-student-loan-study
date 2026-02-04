"use client";

import { useReducer, useRef } from "react";
import { QuizProgress } from "./QuizProgress";
import { RegionQuestion } from "./RegionQuestion";
import { ResultScreen } from "./ResultScreen";
import { StartYearQuestion } from "./StartYearQuestion";
import type { StartYearGroup, Region } from "@/lib/quiz/determinePlan";
import {
  trackQuizStarted,
  trackQuizRegionSelected,
  trackQuizYearSelected,
  trackQuizBackClicked,
} from "@/lib/analytics";
import { determinePlan, canSkipStartYear } from "@/lib/quiz/determinePlan";

type QuizStep = "region" | "start-year" | "result";

interface QuizState {
  currentStep: QuizStep;
  region: Region | null;
  startYearGroup: StartYearGroup | null;
  direction: "forward" | "backward";
}

type QuizAction =
  | { type: "SET_REGION"; payload: Region }
  | { type: "SET_START_YEAR"; payload: StartYearGroup }
  | { type: "GO_BACK" }
  | { type: "RESTART" };

const initialState: QuizState = {
  currentStep: "region",
  region: null,
  startYearGroup: null,
  direction: "forward",
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SET_REGION": {
      const region = action.payload;
      // Scotland/NI → go directly to result, England/Wales → go to start-year
      const nextStep = canSkipStartYear(region) ? "result" : "start-year";
      return {
        ...state,
        region,
        currentStep: nextStep,
        direction: "forward",
      };
    }
    case "SET_START_YEAR":
      return {
        ...state,
        startYearGroup: action.payload,
        currentStep: "result",
        direction: "forward",
      };
    case "GO_BACK": {
      if (state.currentStep === "start-year") {
        return {
          ...state,
          currentStep: "region",
          direction: "backward",
        };
      }
      if (state.currentStep === "result") {
        // If region doesn't need start year, go back to region; otherwise go to start-year
        const previousStep =
          state.region && canSkipStartYear(state.region)
            ? "region"
            : "start-year";
        return {
          ...state,
          currentStep: previousStep,
          direction: "backward",
        };
      }
      return state;
    }
    case "RESTART":
      return initialState;
    default:
      return state;
  }
}

function getTotalSteps(region: Region | null): number {
  // Scotland/NI: 1 question, England/Wales: 2 questions
  if (region && canSkipStartYear(region)) {
    return 1;
  }
  return 2;
}

function getCurrentStepIndex(step: QuizStep, region: Region | null): number {
  if (step === "region") return 0;
  if (step === "start-year") return 1;
  // Result step - return the total steps (not shown in progress)
  return getTotalSteps(region);
}

export function QuizContainer() {
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

  const handleBack = () => {
    trackQuizBackClicked(currentStepIndex);
    dispatch({ type: "GO_BACK" });
  };

  const handleRestart = () => {
    hasStartedRef.current = false;
    dispatch({ type: "RESTART" });
  };

  const totalSteps = getTotalSteps(state.region);
  const currentStepIndex = getCurrentStepIndex(state.currentStep, state.region);
  const showProgress = state.currentStep !== "result";
  const canGoBack = state.currentStep !== "region";

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {showProgress && (
        <QuizProgress
          currentStep={currentStepIndex}
          totalSteps={totalSteps}
          onBack={canGoBack ? handleBack : undefined}
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

          {state.currentStep === "result" && state.region && (
            <ResultScreen
              planType={determinePlan({
                region: state.region,
                startYearGroup: state.startYearGroup ?? undefined,
              })}
              onRestart={handleRestart}
              direction={state.direction}
            />
          )}
        </div>
      </main>
    </div>
  );
}
