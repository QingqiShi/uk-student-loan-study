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
import { CURRENT_RATES } from "@/lib/loans/plans";

// All rates derive from plans.ts so they track the current GOV.UK / BoE figures.
const rpi = CURRENT_RATES.rpi;
const maxRate = rpi + 3;
const plan1And4Rate = Math.min(rpi, CURRENT_RATES.boeBaseRate + 1);

const rows = [
  {
    plan: "Plan 1",
    formula: "Lower of RPI or Bank of England base rate + 1%",
    rate: formatPercent(plan1And4Rate),
  },
  {
    plan: "Plan 2",
    formula: "RPI to RPI + 3% (sliding scale by income)",
    rate: `${formatPercent(rpi)}–${formatPercent(maxRate)}`,
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
    formula: "RPI + 3% (all incomes)",
    rate: formatPercent(maxRate),
  },
];

export function CurrentRatesTable() {
  return (
    <ScrollFadeWrapper className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Plan</TableHead>
            <TableHead scope="col">How it&apos;s set</TableHead>
            <TableHead scope="col">Current rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.plan}>
              <TableHead scope="row">{row.plan}</TableHead>
              <TableCell className="whitespace-normal">{row.formula}</TableCell>
              <TableCell>{row.rate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollFadeWrapper>
  );
}
