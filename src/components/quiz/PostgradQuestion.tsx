"use client";

import { OptionCard } from "./OptionCard";
import { QuestionStep } from "./QuestionStep";

type PostgradAnswer = "loan" | "self-funded" | "no";

interface PostgradQuestionProps {
  onSelect: (answer: PostgradAnswer) => void;
  selectedValue: PostgradAnswer | null;
  direction: "forward" | "backward";
}

const OPTIONS: Array<{
  value: PostgradAnswer;
  label: string;
  sublabel: string;
}> = [
  {
    value: "loan",
    label: "Yes, with a Postgraduate Loan",
    sublabel: "From Student Finance, available since 2016",
  },
  {
    value: "self-funded",
    label: "Yes, self-funded",
    sublabel: "Scholarship, employer, or self-funded",
  },
  {
    value: "no",
    label: "No",
    sublabel: "No postgraduate study",
  },
];

export function PostgradQuestion({
  onSelect,
  selectedValue,
  direction,
}: PostgradQuestionProps) {
  return (
    <QuestionStep
      title="Did you go on to study a Master's or PhD?"
      direction={direction}
    >
      <div
        className="flex flex-col gap-3"
        role="radiogroup"
        aria-label="Postgraduate study"
      >
        {OPTIONS.map((option) => (
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
