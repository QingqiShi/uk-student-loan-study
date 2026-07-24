"use client";

import type { StartYearGroup } from "@/lib/quiz/determinePlan";
import { OptionCard } from "./OptionCard";
import { OptionGroup } from "./OptionGroup";
import { QuestionStep } from "./QuestionStep";

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

  return (
    <QuestionStep
      title={`Did you start another course after ${dateLabel}?`}
      subtitle="Only if you began a second, separate course. Most people answer No."
      direction={direction}
    >
      <OptionGroup
        label="Did you start another course?"
        className="flex flex-col gap-3"
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
      </OptionGroup>
    </QuestionStep>
  );
}
