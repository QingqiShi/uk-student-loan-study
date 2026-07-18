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
  PLAN_CONFIGS,
  PLAN_DISPLAY_INFO,
  POSTGRADUATE_DISPLAY_INFO,
} from "@/lib/loans/plans";
import { surfaceCard } from "@/lib/surfaces";
import { specHead, specHeadNum, specNum } from "../guide-parts";

// All figures derive from plans.ts so they track the current GOV.UK values.
const plans = [
  { display: PLAN_DISPLAY_INFO.PLAN_1, config: PLAN_CONFIGS.PLAN_1 },
  { display: PLAN_DISPLAY_INFO.PLAN_2, config: PLAN_CONFIGS.PLAN_2 },
  { display: PLAN_DISPLAY_INFO.PLAN_4, config: PLAN_CONFIGS.PLAN_4 },
  { display: PLAN_DISPLAY_INFO.PLAN_5, config: PLAN_CONFIGS.PLAN_5 },
  {
    display: POSTGRADUATE_DISPLAY_INFO,
    config: PLAN_CONFIGS.POSTGRADUATE,
  },
] as const;

const rows = plans.map(({ display, config }) => ({
  name: display.name,
  region: display.region,
  annual: formatGBP(config.monthlyThreshold * 12),
  monthly: formatGBP(config.monthlyThreshold),
  rate: formatPercent(config.repaymentRate * 100),
}));

export function CurrentThresholdsTable() {
  return (
    <ScrollFadeWrapper className={surfaceCard}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className={specHead}>
              Plan
            </TableHead>
            <TableHead scope="col" className={specHeadNum}>
              Annual threshold
            </TableHead>
            <TableHead scope="col" className={specHeadNum}>
              Monthly threshold
            </TableHead>
            <TableHead scope="col" className={specHeadNum}>
              Repayment rate
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableHead scope="row" className="font-semibold text-foreground">
                {row.name}
                <span className="block text-xs font-normal text-muted-foreground">
                  {row.region}
                </span>
              </TableHead>
              <TableCell className={specNum}>{row.annual}</TableCell>
              <TableCell className={specNum}>{row.monthly}</TableCell>
              <TableCell className={specNum}>{row.rate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollFadeWrapper>
  );
}
