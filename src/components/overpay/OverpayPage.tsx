"use client";

import { useState } from "react";
import { RelatedGuidesSection } from "@/components/detail/RelatedContent";
import { WideLayout } from "@/components/layout/WideLayout";
import { SituationSection } from "@/components/shared/ControlBar";
import { LoanBreakdownSection } from "@/components/shared/InsightCards";
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

  const handleRepaymentYearChange = (year: number) => {
    setRepaymentDate(new Date(year, REPAYMENT_START_MONTH, 1));
  };

  return (
    <>
      <PlanFromQuery onRepaymentYearChange={handleRepaymentYearChange} />
      <WideLayout repaymentYear={repaymentDate.getFullYear()}>
        <OverpayFold analysis={analysis} />

        <SituationSection
          heading="Whose loan are we comparing?"
          intro="The comparison above runs on this income, balance and repayment start year."
        >
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
        </SituationSection>

        <LoanBreakdownSection
          excludeHref="/overpay"
          intro="The same figures the repayment calculator reports for this loan, before any overpayment. Open any one for the full working."
        />

        <RelatedGuidesSection intro="Background on the rules behind the comparison: how interest accrues, and when paying upfront beats borrowing." />
      </WideLayout>
    </>
  );
}
