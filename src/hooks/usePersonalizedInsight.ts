import {
  useLoanConfig,
  useCurrentSalary,
  useSalaryGrowthRate,
  useThresholdGrowthRate,
} from "./useStoreSelectors";
import { SALARY_GROWTH_RATES, THRESHOLD_GROWTH_RATES } from "@/constants";
import { generateInsight, type Insight } from "@/utils/insights";

/**
 * Hook that computes a personalized insight based on current salary and loan config
 */
export function usePersonalizedInsight(): Insight | null {
  const config = useLoanConfig();
  const salary = useCurrentSalary();
  const salaryGrowthPreset = useSalaryGrowthRate();
  const thresholdGrowthPreset = useThresholdGrowthRate();

  return generateInsight(salary, {
    ...config,
    salaryGrowthRate: SALARY_GROWTH_RATES[salaryGrowthPreset],
    thresholdGrowthRate: THRESHOLD_GROWTH_RATES[thresholdGrowthPreset],
  });
}
