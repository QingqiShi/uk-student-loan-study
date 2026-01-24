import dayjs from 'dayjs';
import { useMemo } from 'react';
import {
  PLAN5_MONTHLY_THRESHOLD,
  PLAN5_MONTHLY_REPAY_RATE,
  PLAN2_WRITE_OFF,
  PLAN5_WRITE_OFF,
  POST_GRAD_WRITE_OFF,
} from '../constants';
import { useStore } from '../store';
import { ChartBase } from './ChartBase';

const MIN_SALARY = 30_000;
const MAX_SALARY = 200_000;
const SALARY_STEP = 5_000;
const PLAN2_MONTHLY_THRESHOLD = 2274;
const POST_GRAD_MONTHLY_THRESHOLD = 1750;
const PLAN2_MONTHLY_REPAY_RATE = 0.09;
const POST_GRAD_MONTHLY_REPAY_RATE = 0.06;
const PLAN2_LT = 27_295;
const PLAN2_UT = 49_130;

const getPlan2Rate = (salary: number, lr: number, hr: number) => {
  if (salary <= PLAN2_LT) {
    return lr;
  }
  if (salary > PLAN2_UT) {
    return hr;
  }
  return ((salary - PLAN2_LT) / (PLAN2_UT - PLAN2_LT)) * (hr - lr) + lr;
};

const formatter = Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

export function InterestRateChart() {
  const {
    isPost2023,
    underGradBalance,
    postGradBalance,
    plan2LTRate,
    plan2UTRate,
    plan5Rate,
    postGradRate,
    repaymentDate,
    salary,
  } = useStore((state) => ({
    isPost2023: state.isPost2023,
    underGradBalance: state.underGradBalance,
    postGradBalance: state.postGradBalance,
    plan2LTRate: state.plan2LTRate,
    plan2UTRate: state.plan2UTRate,
    plan5Rate: state.plan5Rate,
    postGradRate: state.postGradRate,
    repaymentDate: state.repaymentDate,
    salary: state.salary,
  }));

  const data = useMemo(() => {
    const data: [number, number][] = [];
    for (let salary = MIN_SALARY; salary <= MAX_SALARY; salary += SALARY_STEP) {
      const monthlySalary = salary / 12;
      const plan2Repayment =
        monthlySalary > PLAN2_MONTHLY_THRESHOLD
          ? (monthlySalary - PLAN2_MONTHLY_THRESHOLD) * PLAN2_MONTHLY_REPAY_RATE
          : 0;
      const plan5Repayment =
        monthlySalary > PLAN5_MONTHLY_THRESHOLD
          ? (monthlySalary - PLAN5_MONTHLY_THRESHOLD) * PLAN5_MONTHLY_REPAY_RATE
          : 0;
      const postGradRepayment =
        monthlySalary > POST_GRAD_MONTHLY_THRESHOLD
          ? (monthlySalary - POST_GRAD_MONTHLY_THRESHOLD) *
            POST_GRAD_MONTHLY_REPAY_RATE
          : 0;
      const monthlyPlan2Rate =
        getPlan2Rate(salary, plan2LTRate, plan2UTRate) / 100 / 12;
      const monthlyPlan5Rate = plan5Rate / 100 / 12;
      const monthlyPostGradRate = postGradRate / 100 / 12;

      const plan2EndDate = dayjs(repaymentDate).add(PLAN2_WRITE_OFF, 'years');
      const plan5EndDate = dayjs(repaymentDate).add(PLAN5_WRITE_OFF, 'years');
      const postGradEndDate = dayjs(repaymentDate).add(
        POST_GRAD_WRITE_OFF,
        'years'
      );
      const plan2RemainingMonths = plan2EndDate.diff(dayjs(), 'months');
      const plan5RemainingMonths = plan5EndDate.diff(dayjs(), 'months');
      const postGradRemainingMonths = postGradEndDate.diff(dayjs(), 'months');

      let underGradRemaining = underGradBalance;
      let plan2Payment = 0;
      let plan5Payment = 0;
      let postGradRemaining = postGradBalance;
      let postGradPayment = 0;
      let months = 0;
      for (
        let month = 0;
        (month <= (isPost2023 ? plan5RemainingMonths : plan2RemainingMonths) ||
          month <= postGradRemainingMonths) &&
        (underGradRemaining > 0 || postGradRemaining > 0);
        month++
      ) {
        if (
          !isPost2023 &&
          month < plan2RemainingMonths &&
          underGradRemaining > 0
        ) {
          underGradRemaining += underGradRemaining * monthlyPlan2Rate;
          const payment = Math.min(plan2Repayment, underGradRemaining);
          underGradRemaining -= payment;
          plan2Payment += payment;
        } else if (
          isPost2023 &&
          month < plan5RemainingMonths &&
          underGradRemaining > 0
        ) {
          underGradRemaining += underGradRemaining * monthlyPlan5Rate;
          const payment = Math.min(plan5Repayment, underGradRemaining);
          underGradRemaining -= payment;
          plan5Payment += payment;
        }
        if (postGradRemaining > 0) {
          postGradRemaining += postGradRemaining * monthlyPostGradRate;
          const payment = Math.min(postGradRepayment, postGradRemaining);
          postGradRemaining -= payment;
          postGradPayment += payment;
        }
        months = month;
      }

      const roi =
        ((isPost2023 ? plan5Payment : plan2Payment) + postGradPayment) /
        (underGradBalance + postGradBalance);

      const r = Math.pow(roi, 1 / (months / 12)) - 1;

      data.push([salary, r]);
    }
    return data;
  }, [
    isPost2023,
    plan2LTRate,
    plan2UTRate,
    plan5Rate,
    postGradBalance,
    postGradRate,
    repaymentDate,
    underGradBalance,
  ]);

  const annotateDataPoint =
    salary > MIN_SALARY && salary < MAX_SALARY
      ? data.find((d) => d[0] >= salary)
      : undefined;

  return (
    <ChartBase
      data={data}
      annotateDataPoint={annotateDataPoint}
      xAxisLabel="Salary"
      yAxisLabel="Annualized Interest Rate"
      xFormatter={formatter.format}
      yFormatter={(y) => `${(y * 100).toFixed(1)}%`}
    />
  );
}

export default InterestRateChart;
