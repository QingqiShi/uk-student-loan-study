import { useStore } from '../store';
import type { LoanConfig } from '../types';

/** Select the loan configuration for simulation calculations */
export function useLoanConfig(): LoanConfig {
  return useStore((state) => ({
    isPost2023: state.isPost2023,
    underGradBalance: state.underGradBalance,
    postGradBalance: state.postGradBalance,
    plan2LTRate: state.plan2LTRate,
    plan2UTRate: state.plan2UTRate,
    plan5Rate: state.plan5Rate,
    postGradRate: state.postGradRate,
    repaymentDate: state.repaymentDate,
  }));
}

/** Select current salary for chart annotation */
export function useCurrentSalary(): number {
  return useStore((state) => state.salary);
}
