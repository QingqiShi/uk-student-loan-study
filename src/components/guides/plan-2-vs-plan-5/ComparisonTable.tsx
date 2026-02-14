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
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th
              scope="col"
              className="px-4 py-3 text-left font-medium text-muted-foreground"
            >
              Feature
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium">
              Plan 2
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium">
              Plan 5
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b last:border-b-0">
              <th
                scope="row"
                className="px-4 py-3 text-left font-medium text-muted-foreground"
              >
                {row.label}
              </th>
              <td className="px-4 py-3">{row.plan2}</td>
              <td className="px-4 py-3">{row.plan5}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
