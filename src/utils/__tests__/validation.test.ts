import { describe, it, expect } from 'vitest';
import {
  validateBalance,
  validateRate,
  validateSalary,
  validateRepaymentDate,
  validateLoanConfig,
} from '../validation';

describe('validateBalance', () => {
  it('accepts valid balance', () => {
    expect(validateBalance(50_000)).toEqual({ isValid: true });
  });

  it('accepts zero balance', () => {
    expect(validateBalance(0)).toEqual({ isValid: true });
  });

  it('rejects negative balance', () => {
    const result = validateBalance(-1000);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('negative');
  });

  it('rejects NaN', () => {
    const result = validateBalance(NaN);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('valid number');
  });

  it('rejects extremely high balance', () => {
    const result = validateBalance(1_000_000);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('high');
  });
});

describe('validateRate', () => {
  it('accepts valid rate', () => {
    expect(validateRate(6.5)).toEqual({ isValid: true });
  });

  it('accepts zero rate', () => {
    expect(validateRate(0)).toEqual({ isValid: true });
  });

  it('rejects negative rate', () => {
    const result = validateRate(-1);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('negative');
  });

  it('rejects rate above 30%', () => {
    const result = validateRate(35);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('30%');
  });
});

describe('validateSalary', () => {
  it('accepts valid salary', () => {
    expect(validateSalary(45_000)).toEqual({ isValid: true });
  });

  it('accepts zero salary', () => {
    expect(validateSalary(0)).toEqual({ isValid: true });
  });

  it('rejects negative salary', () => {
    const result = validateSalary(-1);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('negative');
  });

  it('rejects extremely high salary', () => {
    const result = validateSalary(100_000_000);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('high');
  });
});

describe('validateRepaymentDate', () => {
  it('accepts valid past date', () => {
    expect(validateRepaymentDate(new Date('2022-04-01'))).toEqual({ isValid: true });
  });

  it('rejects null date', () => {
    const result = validateRepaymentDate(null);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('required');
  });

  it('rejects future date', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const result = validateRepaymentDate(futureDate);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('future');
  });

  it('rejects very old date', () => {
    const result = validateRepaymentDate(new Date('1980-01-01'));
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('past');
  });
});

describe('validateLoanConfig', () => {
  const validConfig = {
    underGradBalance: 50_000,
    postGradBalance: 0,
    plan2LTRate: 6.5,
    plan2UTRate: 6.5,
    plan5Rate: 4.5,
    postGradRate: 6.5,
    salary: 45_000,
    repaymentDate: new Date('2022-04-01'),
  };

  it('accepts valid configuration', () => {
    expect(validateLoanConfig(validConfig)).toEqual({ isValid: true });
  });

  it('rejects invalid undergraduate balance', () => {
    const result = validateLoanConfig({ ...validConfig, underGradBalance: -1 });
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Undergraduate');
  });

  it('rejects invalid postgraduate balance', () => {
    const result = validateLoanConfig({ ...validConfig, postGradBalance: -1 });
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Postgraduate');
  });

  it('rejects invalid salary', () => {
    const result = validateLoanConfig({ ...validConfig, salary: -1 });
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Salary');
  });

  it('rejects null repayment date', () => {
    const result = validateLoanConfig({ ...validConfig, repaymentDate: null });
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('required');
  });
});
