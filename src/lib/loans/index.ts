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

// Overpay analysis types
export type {
  OverpayInput,
  ScenarioResult,
  InvestmentResult,
  RecommendationType,
  NetWorthDataPoint,
  OverpayAnalysisResult,
} from "./overpay-types";

// Config (for UI dropdowns, display names, etc.)
export { PLAN_CONFIGS, CURRENT_RATES } from "./plans";

// Core functions
export { simulateLoans } from "./simulate";
export { getAnnualInterestRate } from "./interest";

// Overpay analysis
export { simulateOverpayScenarios } from "./overpay-simulate";
