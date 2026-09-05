import { ScrollFadeWrapper } from "@/components/shared/ScrollFadeWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatGBP, formatPercent } from "@/lib/format";
import {
  getMaxAnnualInterestRate,
  NO_INTEREST_CAP,
} from "@/lib/loans/interest";
import { CURRENT_RATES, PLAN_CONFIGS } from "@/lib/loans/plans";
import { surfaceCard } from "@/lib/surfaces";
import { specHead, specHeadNum, specNum } from "../guide-parts";

const rpi = CURRENT_RATES.rpi;
// The formula's ceiling with the cap lifted, shown alongside the cap in
// force so the table reads as "before" versus "after".
const uncappedMaxRate = getMaxAnnualInterestRate(
  "PLAN_2",
  rpi,
  CURRENT_RATES.boeBaseRate,
  NO_INTEREST_CAP,
);

const rows = [
  { figure: "Base RPI", value: formatPercent(rpi) },
  {
    figure: "Plan 2 minimum interest rate (RPI, lower earners)",
    value: formatPercent(rpi),
  },
  {
    figure: "Plan 2 maximum interest rate: RPI + 3% before the cap",
    value: formatPercent(uncappedMaxRate),
  },
  {
    figure: "Income at which the maximum rate applies",
    value: `Above ${formatGBP(PLAN_CONFIGS.PLAN_2.interestUpperThreshold)}`,
  },
  {
    figure: "Interest cap (in force)",
    value: formatPercent(CURRENT_RATES.interestCap),
  },
];

export function CurrentCapTable() {
  return (
    <ScrollFadeWrapper className={surfaceCard}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className={specHead}>
              Figure
            </TableHead>
            <TableHead scope="col" className={specHeadNum}>
              Value
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.figure}>
              <TableHead
                scope="row"
                className="font-medium whitespace-normal text-muted-foreground"
              >
                {row.figure}
              </TableHead>
              <TableCell className={specNum}>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollFadeWrapper>
  );
}
