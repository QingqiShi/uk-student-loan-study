"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { Heading } from "@/components/typography/Heading";

interface QuestionStepProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  direction: "forward" | "backward";
}

export function QuestionStep({
  title,
  subtitle,
  children,
  direction,
}: QuestionStepProps) {
  const subtitleId = useId();
  return (
    <div
      className={
        direction === "backward"
          ? "animate-quiz-slide-in-reverse"
          : "animate-quiz-slide-in"
      }
    >
      <div className="mb-8 text-center">
        {/* `data-step-heading` + tabIndex let QuizContainer move focus here on
            each step change, so keyboard/SR users land on the new question
            instead of being dropped back to <body>. `aria-describedby` ties the
            subtitle to the heading so the screen reader also reads the
            disambiguating hint (e.g. "the year you began, not graduated") when
            focus lands — it's no longer inside a live region. */}
        <Heading
          as="h2"
          size="section"
          data-step-heading
          tabIndex={-1}
          aria-describedby={subtitle ? subtitleId : undefined}
          className="outline-none"
        >
          {title}
        </Heading>
        {subtitle && (
          <p
            id={subtitleId}
            className="mt-2 text-sm text-muted-foreground md:text-base"
          >
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}
