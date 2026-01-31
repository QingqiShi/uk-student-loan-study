"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface YearSelectorProps {
  id: string;
  label: string;
  helperText?: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
}

// UK student loan repayments start in April
const REPAYMENT_START_MONTH = 3; // 0-indexed (April)
const REPAYMENT_START_DAY = 6;

// MIN_YEAR: Plan 1 (earliest current plan) started in 1998, but 2000 is a practical lower bound
// MAX_YEAR: ~10 years ahead allows for recent graduates planning long-term repayments
const MIN_YEAR = 2000;
const MAX_YEAR = 2035;
const currentYear = new Date().getFullYear();

function getYearFromDate(date: Date | null): number {
  if (!date) return currentYear;
  return date.getFullYear();
}

function createDateFromYear(year: number): Date {
  return new Date(year, REPAYMENT_START_MONTH, REPAYMENT_START_DAY);
}

function getDecadeStart(year: number): number {
  return Math.floor(year / 10) * 10;
}

function getYearsForDecade(decadeStart: number): number[] {
  // Show decade - 1 to decade + 10 (12 years total)
  const years: number[] = [];
  for (let i = decadeStart - 1; i <= decadeStart + 10; i++) {
    years.push(i);
  }
  return years;
}

export function YearSelector({
  id,
  label,
  helperText,
  value,
  onChange,
}: YearSelectorProps) {
  const selectedYear = getYearFromDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [decadeStart, setDecadeStart] = useState(() =>
    getDecadeStart(selectedYear),
  );

  const years = getYearsForDecade(decadeStart);
  const decadeLabel = `${String(decadeStart)}-${String(decadeStart + 9)}`;

  function handleYearSelect(year: number) {
    onChange(createDateFromYear(year));
    setIsOpen(false);
  }

  function prevDecade() {
    setDecadeStart((d) => d - 10);
  }

  function nextDecade() {
    setDecadeStart((d) => d + 10);
  }

  function isYearDisabled(year: number): boolean {
    return year < MIN_YEAR || year > MAX_YEAR;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          render={
            <Button id={id} variant="outline" className="w-20 tabular-nums" />
          }
        >
          {selectedYear}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex items-center justify-between gap-2 px-1 pb-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={prevDecade}
              disabled={decadeStart <= MIN_YEAR}
              aria-label="Previous decade"
            >
              <HugeiconsIcon icon={ArrowLeftIcon} />
            </Button>
            <span className="text-sm font-medium tabular-nums">
              {decadeLabel}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={nextDecade}
              disabled={decadeStart + 10 > MAX_YEAR}
              aria-label="Next decade"
            >
              <HugeiconsIcon icon={ArrowRightIcon} />
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {years.map((year) => (
              <Button
                key={year}
                variant={year === selectedYear ? "default" : "ghost"}
                size="sm"
                className="tabular-nums"
                disabled={isYearDisabled(year)}
                onClick={() => {
                  handleYearSelect(year);
                }}
              >
                {year}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

export default YearSelector;
