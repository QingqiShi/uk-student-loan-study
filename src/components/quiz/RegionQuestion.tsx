"use client";

import type { Region } from "@/lib/quiz/determinePlan";
import { OptionCard } from "./OptionCard";
import { OptionGroup } from "./OptionGroup";
import { QuestionStep } from "./QuestionStep";

interface RegionQuestionProps {
  onSelect: (region: Region) => void;
  selectedValue: Region | null;
  direction: "forward" | "backward";
}

// Monochrome initial chips instead of OS colour flag emoji, so no off-palette
// hue enters the instrument — the chip inherits the spruce/muted token from
// OptionCard. The full nation name stays in the label.
const REGION_OPTIONS: Array<{
  value: Region;
  label: string;
  initial: string;
}> = [
  {
    value: "england",
    label: "England",
    initial: "E",
  },
  {
    value: "wales",
    label: "Wales",
    initial: "W",
  },
  {
    value: "scotland",
    label: "Scotland",
    initial: "S",
  },
  {
    value: "northern-ireland",
    label: "Northern Ireland",
    initial: "NI",
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
      <OptionGroup
        label="Select where you studied"
        className="grid grid-cols-1 gap-3 xs:grid-cols-2"
      >
        {REGION_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            icon={
              <span className="font-sans text-sm font-semibold tracking-wide">
                {option.initial}
              </span>
            }
            isSelected={selectedValue === option.value}
            onClick={() => {
              onSelect(option.value);
            }}
          />
        ))}
      </OptionGroup>
    </QuestionStep>
  );
}
