import { ScrollFadeWrapper } from "@/components/shared/ScrollFadeWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PLAN_CONFIGS, PLAN_DISPLAY_INFO } from "@/lib/loans/plans";

const plan2 = PLAN_DISPLAY_INFO.PLAN_2;
const plan5 = PLAN_DISPLAY_INFO.PLAN_5;

const plan2Threshold = String(PLAN_CONFIGS.PLAN_2.monthlyThreshold * 12);
const plan5Threshold = String(PLAN_CONFIGS.PLAN_5.monthlyThreshold * 12);
const repaymentRate = String(plan2.repaymentRate * 100);

const rows = [
  {
    label: "Eligibility",
    plan2: plan2.years,
    plan5: plan5.years,
  },
  {
    label: "Repayment threshold",
    plan2: `\u00a3${plan2Threshold}/yr`,
    plan5: `\u00a3${plan5Threshold}/yr`,
  },
  {
    label: "Repayment rate",
    plan2: `${repaymentRate}%`,
    plan5: `${repaymentRate}%`,
  },
  {
    label: "Interest rate",
    plan2: "RPI to RPI + 3% (sliding scale)",
    plan5: "RPI only",
  },
  {
    label: "Write-off period",
    plan2: `${String(plan2.writeOffYears)} years`,
    plan5: `${String(plan5.writeOffYears)} years`,
  },
];

export function ComparisonTable() {
  return (
    <ScrollFadeWrapper className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Feature</TableHead>
            <TableHead scope="col">Plan 2</TableHead>
            <TableHead scope="col">Plan 5</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableHead scope="row">{row.label}</TableHead>
              <TableCell>{row.plan2}</TableCell>
              <TableCell>{row.plan5}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollFadeWrapper>
  );
}
