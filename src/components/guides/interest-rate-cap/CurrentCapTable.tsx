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
import { CURRENT_RATES, PLAN_CONFIGS } from "@/lib/loans/plans";
import { surfaceCard } from "@/lib/surfaces";
import { specHead, specHeadNum, specNum } from "../guide-parts";

// The 6% cap is a policy figure (Sept 2026), not something plans.ts supplies —
// kept as a labelled constant, consistent with the rest of this guide.
const INTEREST_CAP_RATE = 6;

const rpi = CURRENT_RATES.rpi;
const maxRate = rpi + 3;

const rows = [
  { figure: "Base RPI", value: formatPercent(rpi) },
  {
    figure: "Plan 2 minimum interest rate (RPI, lower earners)",
    value: formatPercent(rpi),
  },
  {
    figure: "Plan 2 maximum interest rate (RPI + 3%)",
    value: formatPercent(maxRate),
  },
  {
    figure: "Income at which the maximum rate applies",
    value: `Above ${formatGBP(PLAN_CONFIGS.PLAN_2.interestUpperThreshold)}`,
  },
  {
    figure: "Interest rate cap (from 1 September 2026)",
    value: formatPercent(INTEREST_CAP_RATE),
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
