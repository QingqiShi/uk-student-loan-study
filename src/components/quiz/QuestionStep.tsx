"use client";

import type { ReactNode } from "react";
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
        <Heading as="h1" className="text-foreground md:text-3xl">
          {title}
        </Heading>
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
