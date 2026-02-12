"use client";

import { OptionCard } from "./OptionCard";
import { QuestionStep } from "./QuestionStep";
import type { StartYearGroup } from "@/lib/quiz/determinePlan";

interface AdditionalCourseQuestionProps {
  onSelect: (hasAdditionalCourse: boolean) => void;
  selectedValue: boolean | null;
  direction: "forward" | "backward";
  yearGroup: StartYearGroup;
}

export function AdditionalCourseQuestion({
  onSelect,
  selectedValue,
  direction,
  yearGroup,
}: AdditionalCourseQuestionProps) {
  const dateLabel =
    yearGroup === "before-2012" ? "September 2012" : "August 2023";
  const planLabel = yearGroup === "before-2012" ? "Plan 2" : "Plan 5";

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
