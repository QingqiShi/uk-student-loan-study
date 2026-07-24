"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  sublabel?: string;
  icon?: ReactNode;
  isSelected: boolean;
  onClick: () => void;
  variant?: "radio" | "checkbox";
}

export function OptionCard({
  label,
  sublabel,
  icon,
  isSelected,
  onClick,
  variant = "radio",
}: OptionCardProps) {
  return (
    <button
      type="button"
      role={variant}
      aria-checked={isSelected}
      aria-label={sublabel ? `${label}, ${sublabel}` : label}
      onClick={onClick}
      className={cn(
        "group relative flex size-full min-h-18 items-center gap-4 rounded-xl px-5 py-4 text-left ring-1 transition-colors duration-150",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-inset",
        isSelected
          ? "bg-accent-wash ring-primary"
          : "bg-card ring-input hover:bg-muted",
      )}
    >
      {icon && (
        <div
          aria-hidden="true"
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg text-lg ring-1 transition-colors",
            isSelected
              ? "bg-card text-cta ring-primary/30"
              : "bg-muted text-muted-foreground ring-border",
          )}
        >
          {icon}
        </div>
      )}

      <div className="flex-1">
        <span
          className={cn(
            "block font-medium transition-colors",
            isSelected ? "text-cta" : "text-foreground",
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

      {variant === "radio" ? (
        <div
          className={cn(
            "size-5 shrink-0 rounded-full ring-2 transition-colors",
            isSelected ? "bg-primary ring-primary" : "ring-input",
          )}
        >
          {isSelected && (
            <svg
              className="size-full text-primary-foreground"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-md ring-2 transition-colors",
            isSelected ? "bg-primary ring-primary" : "ring-input",
          )}
        >
          {isSelected && (
            <svg
              className="size-3.5 text-primary-foreground"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2.5 7.5L5.5 10.5L11.5 3.5" />
            </svg>
          )}
        </div>
      )}
    </button>
  );
}
