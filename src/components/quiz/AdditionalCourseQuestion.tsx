"use client";

import { PLAN_DISPLAY_INFO } from "@/lib/loans/plans";
import type { Region, StartYearGroup } from "@/lib/quiz/determinePlan";
import { getAdditionalCoursePlan } from "@/lib/quiz/determinePlan";
import { OptionCard } from "./OptionCard";
import { QuestionStep } from "./QuestionStep";

interface AdditionalCourseQuestionProps {
  onSelect: (hasAdditionalCourse: boolean) => void;
  selectedValue: boolean | null;
  direction: "forward" | "backward";
  yearGroup: StartYearGroup;
  region: Region;
}

export function AdditionalCourseQuestion({
  onSelect,
  selectedValue,
  direction,
  yearGroup,
  region,
}: AdditionalCourseQuestionProps) {
  const dateLabel =
    yearGroup === "before-2012" ? "September 2012" : "August 2023";
  const additionalPlanType = getAdditionalCoursePlan(yearGroup, region);
  const planLabel = PLAN_DISPLAY_INFO[additionalPlanType].name;

  return (
    <QuestionStep
      title={`Did you start another course after ${dateLabel}?`}
      subtitle={`Starting another course after this date means an additional ${planLabel} loan`}
      direction={direction}
    >
      <div
        className="flex flex-col gap-3"
        role="radiogroup"
        aria-label="Did you start another course?"
      >
        <OptionCard
          label="Yes"
          sublabel={`I started another course after ${dateLabel}`}
          isSelected={selectedValue === true}
          onClick={() => {
            onSelect(true);
          }}
        />
        <OptionCard
          label="No"
          sublabel="Just the one course"
          isSelected={selectedValue === false}
          onClick={() => {
            onSelect(false);
          }}
        />
      </div>
    </QuestionStep>
  );
}
