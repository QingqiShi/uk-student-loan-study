import dayjs from 'dayjs';
import { useMemo } from 'react';
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

interface InterestRateChartProps {}

export function InterestRateChart(_props: InterestRateChartProps) {
  const {
    plan2Balance,
    postGradBalance,
    plan2LTRate,
    plan2UTRate,
    postGradRate,
    repaymentDate,
  } = useStore((state) => ({
    plan2Balance: state.plan2Balance,
    postGradBalance: state.postGradBalance,
    plan2LTRate: state.plan2LTRate,
    plan2UTRate: state.plan2UTRate,
    postGradRate: state.postGradRate,
    repaymentDate: state.repaymentDate,
  }));

  const data = useMemo(() => {
    const data: [number, number][] = [];
    for (let salary = MIN_SALARY; salary <= MAX_SALARY; salary += SALARY_STEP) {
      const monthlySalary = salary / 12;
      const plan2Repayment =
        monthlySalary > PLAN2_MONTHLY_THRESHOLD
          ? (monthlySalary - PLAN2_MONTHLY_THRESHOLD) * PLAN2_MONTHLY_REPAY_RATE
          : 0;
      const postGradRepayment =
        monthlySalary > POST_GRAD_MONTHLY_THRESHOLD
          ? (monthlySalary - POST_GRAD_MONTHLY_THRESHOLD) *
            POST_GRAD_MONTHLY_REPAY_RATE
          : 0;
      const monthlyPlan2Rate =
        getPlan2Rate(salary, plan2LTRate, plan2UTRate) / 100 / 12;
      const monthlyPostGradRate = postGradRate / 100 / 12;

      const endDate = dayjs(repaymentDate).add(30, 'years');
      const remainingMonths = endDate.diff(dayjs(), 'months');

      let plan2Remaining = plan2Balance;
      let plan2Payment = 0;
      let postGradRemaining = postGradBalance;
      let postGradPayment = 0;
      let months = 0;
      for (
        let month = 0;
        month < remainingMonths &&
        (plan2Remaining > 0 || postGradRemaining > 0);
        month++
      ) {
        if (plan2Remaining > 0) {
          plan2Remaining += plan2Remaining * monthlyPlan2Rate;
          const payment = Math.min(plan2Repayment, plan2Remaining);
          plan2Remaining -= payment;
          plan2Payment += payment;
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
        (plan2Payment + postGradPayment) / (plan2Balance + postGradBalance);
      // const annualised ^ (months / 12) = roi
      // console.log({ roi, years: months / 12 });

      const r = Math.pow(roi, 1 / (months / 12)) - 1;

      data.push([salary, r]);
    }
    return data;
  }, [
    plan2Balance,
    plan2LTRate,
    plan2UTRate,
    postGradBalance,
    postGradRate,
    repaymentDate,
  ]);

  return (
    <ChartBase
      data={data}
      xAxisLabel="Salary"
      yAxisLabel="Annualized Interest Rate"
      xFormatter={formatter.format}
      yFormatter={(y) => `${(y * 100).toFixed(1)}%`}
    />
  );
}

export default InterestRateChart;
