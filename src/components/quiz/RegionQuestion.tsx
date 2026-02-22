"use client";

import { OptionCard } from "./OptionCard";
import { QuestionStep } from "./QuestionStep";
import type { Region } from "@/lib/quiz/determinePlan";

interface RegionQuestionProps {
  onSelect: (region: Region) => void;
  selectedValue: Region | null;
  direction: "forward" | "backward";
}

const REGION_OPTIONS: Array<{
  value: Region;
  label: string;
  icon: string;
}> = [
  {
    value: "england",
    label: "England",
    icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  },
  {
    value: "wales",
    label: "Wales",
    icon: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  },
  {
    value: "scotland",
    label: "Scotland",
    icon: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  },
  {
    value: "northern-ireland",
    label: "Northern Ireland",
    icon: "☘️",
  },
];

export function RegionQuestion({
  onSelect,
  selectedValue,
  direction,
}: RegionQuestionProps) {
  return (
    <QuestionStep
      title="Where did you study?"
      subtitle="The UK nation where your university was located"
      direction={direction}
    >
      <div
        className="grid grid-cols-1 gap-3 xs:grid-cols-2"
        role="radiogroup"
        aria-label="Select where you studied"
      >
        {REGION_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            icon={<span className="text-xl">{option.icon}</span>}
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
