"use client";

import type { StartYearGroup } from "@/lib/quiz/determinePlan";
import { OptionCard } from "./OptionCard";
import { QuestionStep } from "./QuestionStep";

interface StartYearQuestionProps {
  onSelect: (yearGroup: StartYearGroup) => void;
  selectedValue: StartYearGroup | null;
  direction: "forward" | "backward";
}

const YEAR_OPTIONS: Array<{
  value: StartYearGroup;
  label: string;
  sublabel: string;
}> = [
  {
    value: "before-2012",
    label: "Before 2012",
    sublabel: "Started before September 2012",
  },
  {
    value: "2012-2022",
    label: "2012 – 2022",
    sublabel: "September 2012 to July 2023",
  },
  {
    value: "2023-or-later",
    label: "2023 or later",
    sublabel: "Started August 2023 onwards",
  },
];

export function StartYearQuestion({
  onSelect,
  selectedValue,
  direction,
}: StartYearQuestionProps) {
  return (
    <QuestionStep
      title="When did you start your course?"
      subtitle="The academic year you began, not graduated"
      direction={direction}
    >
      <div
        className="flex flex-col gap-3"
        role="radiogroup"
        aria-label="Select when you started your course"
      >
        {YEAR_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            sublabel={option.sublabel}
            isSelected={selectedValue === option.value}
            onClick={() => {
              onSelect(option.value);
            }}
          />
        ))}
      </div>
    </QuestionStep>
  );
}
