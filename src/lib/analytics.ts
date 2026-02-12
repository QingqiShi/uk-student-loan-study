import { track } from "@vercel/analytics";

// =============================================================================
// Home Page Events
// =============================================================================

export function trackSalaryChanged(value: number) {
  track("salary_changed", { value });
}

export function trackSalaryGrowthSelected(rate: number) {
  track("salary_growth_selected", { rate });
}

export function trackThresholdGrowthSelected(rate: number) {
  track("threshold_growth_selected", { rate });
}

export function trackPresetApplied(preset: string) {
  track("preset_applied", { preset });
}

export function trackLoanToggled(planType: string, selected: boolean) {
  track("loan_toggled", { planType, selected });
}

export function trackBalanceChanged(planType: string, value: number) {
  track("balance_changed", { planType, value });
}

export function trackPlanInfoViewed(plan: string) {
  track("plan_info_viewed", { plan });
}

export function trackShareClicked(method: string) {
  track("share_clicked", { method });
}

export function trackThemeChanged(theme: string) {
  track("theme_changed", { theme });
}

// =============================================================================
// Config Wizard Events
// =============================================================================

type WizardType = "loan" | "assumptions";

export function trackWizardStarted(wizardType: WizardType) {
  track("wizard_started", { wizardType });
}

export function trackWizardStepViewed(wizardType: WizardType, step: string) {
  track("wizard_step_viewed", { wizardType, step });
}

export function trackWizardCompleted(wizardType: WizardType) {
  track("wizard_completed", { wizardType });
}

export function trackWizardBackClicked(
  wizardType: WizardType,
  fromStep: string,
) {
  track("wizard_back_clicked", { wizardType, fromStep });
}

export function trackWizardRestarted(wizardType: WizardType) {
  track("wizard_restarted", { wizardType });
}

// =============================================================================
// Which-Plan Quiz Events
// =============================================================================

export function trackQuizStarted() {
  track("quiz_started", {});
}

export function trackQuizRegionSelected(region: string) {
  track("quiz_region_selected", { region });
}

export function trackQuizYearSelected(yearGroup: string) {
  track("quiz_year_selected", { yearGroup });
}

export function trackQuizBackClicked(fromStep: number) {
  track("quiz_back_clicked", { fromStep });
}

export function trackQuizRestarted() {
  track("quiz_restarted", {});
}

export function trackQuizCompleted(result: string) {
  track("quiz_completed", { result });
}

// =============================================================================
// Overpay Page Events
// =============================================================================

export function trackOverpaySalaryChanged(value: number) {
  track("overpay_salary_changed", { value });
}

export function trackOverpayMonthlyChanged(value: number) {
  track("overpay_monthly_changed", { value });
}

export function trackOverpayLumpsumChanged(value: number) {
  track("overpay_lumpsum_changed", { value });
}

export function trackOverpayYearSelected(year: number) {
  track("overpay_year_selected", { year });
}

export function trackOverpayDecadeNavigated(direction: "previous" | "next") {
  track("overpay_decade_navigated", { direction });
}

// =============================================================================
// Shared URL Parameter Events
// =============================================================================

export function trackSharedLoansLoaded(
  loans: { planType: string; balance: number }[],
) {
  track("shared_loans_loaded", {
    count: loans.length,
    plans: loans.map((l) => l.planType).join(","),
  });
}

export function trackSharedSalaryLoaded(value: number) {
  track("shared_salary_loaded", { value });
}

export function trackSharedMonthlyOverpaymentLoaded(value: number) {
  track("shared_monthly_overpayment_loaded", { value });
}

export function trackSharedSalaryGrowthLoaded(rate: number) {
  track("shared_salary_growth_loaded", { rate });
}

export function trackSharedLumpSumLoaded(value: number) {
  track("shared_lump_sum_loaded", { value });
}

export function trackSharedRepaymentYearLoaded(year: number) {
  track("shared_repayment_year_loaded", { year });
}
