"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import {
  RelatedGuideIndex,
  useRelatedGuides,
} from "@/components/detail/RelatedContent";
import { InstrumentSection } from "@/components/instrument/InstrumentSection";
import { WideLayout } from "@/components/layout/WideLayout";
import { AssumptionsCallout } from "@/components/shared/AssumptionsCallout";
import { ControlBar } from "@/components/shared/ControlBar";
import { InsightCardsReadout } from "@/components/shared/InsightCards";
import { PlanFromQuery } from "@/components/shared/PlanFromQuery";
import { useOverpayAnalysis } from "@/hooks/useOverpayAnalysis";
import { ENGRAVED_LABEL } from "@/lib/layout";
import { REPAYMENT_START_MONTH } from "@/lib/presets";
import { OverpayFold } from "./OverpayFold";
import { YearSelector } from "./YearSelector";

export function OverpayPage() {
  const [repaymentDate, setRepaymentDate] = useState<Date>(
    () => new Date(new Date().getFullYear(), REPAYMENT_START_MONTH, 1),
  );
  const analysis = useOverpayAnalysis(repaymentDate);
  // Read here as well as inside the index so the section's masthead can be
  // withheld too — otherwise retiring a guide leaves a seamed band headed
  // "Related guides" with nothing under it.
  const hasRelatedGuides = useRelatedGuides().length > 0;

  const handleRepaymentYearChange = (year: number) => {
    setRepaymentDate(new Date(year, REPAYMENT_START_MONTH, 1));
  };

  return (
    <>
      <PlanFromQuery onRepaymentYearChange={handleRepaymentYearChange} />
      <WideLayout repaymentYear={repaymentDate.getFullYear()}>
        <OverpayFold analysis={analysis} />

        {/* The intro states what the section feeds, and stops there: the
            ControlBar inside it already tells the reader to pick a scenario or
            enter their own figures, and two copies would drift apart. */}
        <InstrumentSection
          id="situation"
          heading="Whose loan are we comparing?"
          intro="The comparison above runs on this income, balance and repayment start year."
        >
          <div className="mt-[clamp(1.6rem,2.4vw,2.4rem)] space-y-[clamp(1.2rem,1.8vw,1.8rem)] work:mt-0">
            <ControlBar variant="bare" />
            {/* Grouped with the income and balance rather than with the
                overpayment levers: when repayments started is a fact about the
                loan, not a choice about overpaying it. */}
            <YearSelector
              id="overpay-repayment-year"
              label="Repayment start year"
              labelClassName={ENGRAVED_LABEL}
              value={repaymentDate}
              onChange={(value) => {
                if (value) {
                  setRepaymentDate(value);
                }
              }}
            />
            <AssumptionsCallout className="text-left" />
          </div>
        </InstrumentSection>

        <InstrumentSection
          id="breakdown"
          heading="Your loan breakdown"
          intro="The same figures the repayment calculator reports for this loan, before any overpayment. Open any one for the full working."
        >
          <div className="mt-[clamp(1.6rem,2.4vw,2.4rem)] space-y-4 work:mt-0">
            <InsightCardsReadout excludeHref="/overpay" />
            {/* Every cell above leads deeper into a detail page; this is the
                only route back to the full calculator once the nameplate's
                breadcrumb has scrolled away. */}
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-meta font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              Repayment Calculator
            </Link>
          </div>
        </InstrumentSection>

        {hasRelatedGuides && (
          <InstrumentSection
            id="related-guides"
            heading="Related guides"
            intro="Background on the rules behind the comparison — how interest accrues, and when paying upfront beats borrowing."
          >
            {/* Capped to the reading-column width the same index uses on every
                detail page, so a title + dek row never runs the full bleed. */}
            <div className="mt-[clamp(0.6rem,1.4vw,1.4rem)] max-w-4xl work:mt-0">
              <RelatedGuideIndex />
            </div>
          </InstrumentSection>
        )}
      </WideLayout>
    </>
  );
}
