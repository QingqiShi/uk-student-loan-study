"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  sublabel?: string;
  icon?: ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export function OptionCard({
  label,
  sublabel,
  icon,
  isSelected,
  onClick,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onClick}
      className={cn(
        "group relative flex min-h-[72px] w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all duration-150",
        "hover:border-primary/50 hover:bg-accent/50",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        "active:scale-[0.98]",
        isSelected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-border bg-card",
      )}
    >
      {icon && (
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg text-lg",
            isSelected
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          {icon}
        </div>
      )}

      <div className="flex-1">
        <span
          className={cn(
            "block font-medium",
            isSelected ? "text-primary" : "text-foreground",
          )}
        >
          {label}
        </span>
        {sublabel && (
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {sublabel}
          </span>
        )}
      </div>

      <div
        className={cn(
          "size-5 shrink-0 rounded-full border-2 transition-colors",
          isSelected ? "border-primary bg-primary" : "border-muted-foreground",
        )}
      >
        {isSelected && (
          <svg
            className="size-full text-primary-foreground"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
