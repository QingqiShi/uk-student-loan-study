import { ScrollFadeWrapper } from "@/components/shared/ScrollFadeWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPercent } from "@/lib/format";
import { getMaxAnnualInterestRate } from "@/lib/loans/interest";
import { CURRENT_RATES } from "@/lib/loans/plans";
import { surfaceCard } from "@/lib/surfaces";
import { specHead, specHeadNum, specNum } from "../guide-parts";

// All rates derive from plans.ts so they track the current GOV.UK / BoE figures.
const rpi = CURRENT_RATES.rpi;
const capPct = formatPercent(CURRENT_RATES.interestCap);
const plan2MaxRate = getMaxAnnualInterestRate("PLAN_2");
const postgradMaxRate = getMaxAnnualInterestRate("POSTGRADUATE");
const plan1And4Rate = Math.min(rpi, CURRENT_RATES.boeBaseRate + 1);

const rows = [
  {
    plan: "Plan 1",
    formula: "Lower of RPI or Bank of England base rate + 1%",
    rate: formatPercent(plan1And4Rate),
  },
  {
    plan: "Plan 2",
    formula: `RPI to RPI + 3% (sliding scale by income), capped at ${capPct}`,
    rate: `${formatPercent(rpi)}–${formatPercent(plan2MaxRate)}`,
  },
  {
    plan: "Plan 4",
    formula: "Lower of RPI or Bank of England base rate + 1%",
    rate: formatPercent(plan1And4Rate),
  },
  {
    plan: "Plan 5",
    formula: "RPI only",
    rate: formatPercent(rpi),
  },
  {
    plan: "Postgraduate",
    formula: `RPI + 3% (all incomes), capped at ${capPct}`,
    rate: formatPercent(postgradMaxRate),
  },
];

export function CurrentRatesTable() {
  return (
    <ScrollFadeWrapper className={surfaceCard}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className={specHead}>
              Plan
            </TableHead>
            <TableHead scope="col" className={specHead}>
              How it&apos;s set
            </TableHead>
            <TableHead scope="col" className={specHeadNum}>
              Current rate
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.plan}>
              <TableHead scope="row" className="font-semibold text-foreground">
                {row.plan}
              </TableHead>
              <TableCell className="whitespace-normal text-muted-foreground">
                {row.formula}
              </TableCell>
              <TableCell className={specNum}>{row.rate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollFadeWrapper>
  );
}
