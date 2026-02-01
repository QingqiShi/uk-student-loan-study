"use client";

import type { ReactNode } from "react";

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
  return (
    <div
      className={
        direction === "backward"
          ? "animate-quiz-slide-in-reverse"
          : "animate-quiz-slide-in"
      }
      aria-live="polite"
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}
