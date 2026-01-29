// Types
export type {
  PlanType,
  UndergraduatePlanType,
  Loan,
  SimulationInput,
  LoanResult,
  SimulationResult,
  SimulationMapper,
} from "./types";

// Config (for UI dropdowns, display names, etc.)
export { PLAN_CONFIGS, CURRENT_RATES } from "./plans";

// Core functions
export { simulateLoans } from "./simulate";
export { getAnnualInterestRate } from "./interest";
