import {
  useLoanConfig,
  useCurrentSalary,
  useSalaryGrowthRate,
  useThresholdGrowthRate,
} from "./useStoreSelectors";
import { generateInsight, type Insight } from "@/utils/insights";

/**
 * Hook that computes a personalized insight based on current salary and loan config
 */
export function usePersonalizedInsight(): Insight | null {
  const config = useLoanConfig();
  const salary = useCurrentSalary();
  const salaryGrowthRate = useSalaryGrowthRate();
  const thresholdGrowthRate = useThresholdGrowthRate();

  return generateInsight(salary, {
    ...config,
    salaryGrowthRate,
    thresholdGrowthRate,
  });
}
