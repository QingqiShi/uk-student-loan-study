"use client";

import Link from "next/link";
import { HomeSection } from "./HomeSection";
import { useLeverData } from "./leverData";

export function LeversSection() {
  const { refLabel, levers } = useLeverData();

  return (
    <HomeSection
      id="levers"
      heading="What changes your total"
      intro={
        <>
          Each figure is the change to lifetime repayment for your selection
          above ({refLabel}) — everything else held constant.
        </>
      }
    >
      <div className="mt-[clamp(1.6rem,2.4vw,2.4rem)] grid grid-cols-1 gap-x-[clamp(2rem,3vw,3.5rem)] gap-y-[clamp(1.8rem,2.4vw,2.6rem)] roomy:grid-cols-3 work:mt-0">
        {levers.map((lever) => {
          // Down (saves) reads the Principal data green; up (costs) reads the
          // Interest clay — the CVD-safe data pair (text-signal resolves to the
          // same clay via --signal), derived from the datum, not a scoped class.
          const deltaColor =
            lever.direction === "down" ? "text-chart-principal" : "text-signal";
          const barColor =
            lever.direction === "down" ? "bg-chart-principal" : "bg-signal";
          return (
            <div key={lever.name}>
              <div className="mb-[0.4rem] flex items-baseline justify-between gap-[0.8rem]">
                <span className="text-lead font-semibold tracking-[-0.011em]">
                  {lever.name}
                </span>
                {lever.delta && lever.direction && (
                  <span
                    className={`font-mono text-fig-md font-semibold tracking-[-0.015em] whitespace-nowrap tabular-nums ${deltaColor}`}
                  >
                    {lever.delta}
                  </span>
                )}
              </div>
              <p className="max-w-[46ch] text-body leading-[1.55] text-pretty text-muted-foreground">
                {lever.description}
              </p>
              {lever.barPct !== null && lever.direction && (
                <div className="mt-[0.7rem] h-[4px] overflow-hidden rounded-full bg-muted">
                  <i
                    className={`block h-full rounded-full ${barColor}`}
                    style={{ width: `${String(lever.barPct)}%` }}
                  />
                </div>
              )}
              {lever.href && lever.cta && (
                <Link
                  className="group mt-3 inline-flex items-baseline gap-[0.35rem] text-sm font-semibold text-cta no-underline transition-colors duration-150 ease-[ease] hover:text-primary"
                  href={lever.href}
                >
                  {lever.cta}{" "}
                  <span
                    className="text-primary transition-transform duration-150 ease-[ease] group-hover:translate-x-[3px]"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </HomeSection>
  );
}
