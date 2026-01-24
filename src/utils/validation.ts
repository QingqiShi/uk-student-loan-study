/**
 * Validation utilities for loan calculator inputs.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a loan balance amount.
 * Must be a non-negative number within reasonable bounds.
 */
export function validateBalance(value: number): ValidationResult {
  if (!Number.isFinite(value)) {
    return { isValid: false, error: 'Balance must be a valid number' };
  }
  if (value < 0) {
    return { isValid: false, error: 'Balance cannot be negative' };
  }
  if (value > 500_000) {
    return { isValid: false, error: 'Balance seems unusually high' };
  }
  return { isValid: true };
}

/**
 * Validates an interest rate percentage.
 * Must be between 0% and 30% (reasonable bounds for UK student loans).
 */
export function validateRate(value: number): ValidationResult {
  if (!Number.isFinite(value)) {
    return { isValid: false, error: 'Rate must be a valid number' };
  }
  if (value < 0) {
    return { isValid: false, error: 'Rate cannot be negative' };
  }
  if (value > 30) {
    return { isValid: false, error: 'Rate cannot exceed 30%' };
  }
  return { isValid: true };
}

/**
 * Validates a salary amount.
 * Must be a positive number within reasonable bounds.
 */
export function validateSalary(value: number): ValidationResult {
  if (!Number.isFinite(value)) {
    return { isValid: false, error: 'Salary must be a valid number' };
  }
  if (value < 0) {
    return { isValid: false, error: 'Salary cannot be negative' };
  }
  if (value > 10_000_000) {
    return { isValid: false, error: 'Salary seems unusually high' };
  }
  return { isValid: true };
}

/**
 * Validates a repayment start date.
 * Must be a valid date, not in the future, and within reasonable bounds.
 */
export function validateRepaymentDate(value: Date | null): ValidationResult {
  if (value === null) {
    return { isValid: false, error: 'Repayment date is required' };
  }
  if (!(value instanceof Date) || isNaN(value.getTime())) {
    return { isValid: false, error: 'Invalid date' };
  }

  const now = new Date();
  if (value > now) {
    return { isValid: false, error: 'Repayment date cannot be in the future' };
  }

  const minDate = new Date('1990-01-01');
  if (value < minDate) {
    return { isValid: false, error: 'Date seems too far in the past' };
  }

  return { isValid: true };
}

/**
 * Validates the complete loan configuration.
 */
export function validateLoanConfig(config: {
  underGradBalance: number;
  postGradBalance: number;
  plan2LTRate: number;
  plan2UTRate: number;
  plan5Rate: number;
  postGradRate: number;
  salary: number;
  repaymentDate: Date | null;
}): ValidationResult {
  const balanceCheck = validateBalance(config.underGradBalance);
  if (!balanceCheck.isValid) return { ...balanceCheck, error: `Undergraduate balance: ${balanceCheck.error}` };

  const postGradCheck = validateBalance(config.postGradBalance);
  if (!postGradCheck.isValid) return { ...postGradCheck, error: `Postgraduate balance: ${postGradCheck.error}` };

  const plan2LTCheck = validateRate(config.plan2LTRate);
  if (!plan2LTCheck.isValid) return { ...plan2LTCheck, error: `Plan 2 LT rate: ${plan2LTCheck.error}` };

  const plan2UTCheck = validateRate(config.plan2UTRate);
  if (!plan2UTCheck.isValid) return { ...plan2UTCheck, error: `Plan 2 UT rate: ${plan2UTCheck.error}` };

  const plan5Check = validateRate(config.plan5Rate);
  if (!plan5Check.isValid) return { ...plan5Check, error: `Plan 5 rate: ${plan5Check.error}` };

  const postGradRateCheck = validateRate(config.postGradRate);
  if (!postGradRateCheck.isValid) return { ...postGradRateCheck, error: `Postgrad rate: ${postGradRateCheck.error}` };

  const salaryCheck = validateSalary(config.salary);
  if (!salaryCheck.isValid) return { ...salaryCheck, error: `Salary: ${salaryCheck.error}` };

  const dateCheck = validateRepaymentDate(config.repaymentDate);
  if (!dateCheck.isValid) return dateCheck;

  return { isValid: true };
}
