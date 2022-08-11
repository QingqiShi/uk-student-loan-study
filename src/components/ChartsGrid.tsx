import { lazy, Suspense } from 'react';
import { Skeleton, styled, Typography } from '@mui/material';

const InterestRateChart = lazy(() => import('./InterestRateChart'));
const RepaymentYearsChart = lazy(() => import('./RepaymentYearsChart'));
const TotalRepaymentChart = lazy(() => import('./TotalRepaymentChart'));

const Container = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(700px, 1fr))',
  },
  [theme.breakpoints.up('xl')]: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(800px, 1fr))',
  },
}));

const Item = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(4),
  },
}));

const ChartContainer = styled('div')(({ theme }) => ({
  height: 300,
  [theme.breakpoints.up('sm')]: {
    height: 400,
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(4),
    height: 450,
  },
  [theme.breakpoints.up('xl')]: {
    height: 600,
  },
}));

const TextContent = styled('div')(() => ({
  flexGrow: 1,
}));

interface ChartsGridProps {}

export function ChartsGrid(_props: ChartsGridProps) {
  return (
    <Container>
      <Item>
        <TextContent>
          <Typography variant="h6" component="h2" fontWeight="bold">
            How much do you repay in total?
          </Typography>
          <Typography>
            Low income earners usually get the best deal because their student
            loan is written off after 30 years of repayment, and as a result
            never pay back the full amount of their loan. Higher income earners
            usually pay back their loans with small amounts of interest, because
            they are able to repay quickly so interest don&apos;t have much time
            to accumulate. Middle income earners around the peak of the
            following chart should really look into either increasing their
            salaries quickly, or make additional payments to reduce the total
            amount they&apos;ll have to pay back.
          </Typography>
        </TextContent>
        <ChartContainer>
          <Suspense
            fallback={<Skeleton variant="rounded" width="100%" height="100%" />}
          >
            <TotalRepaymentChart />
          </Suspense>
        </ChartContainer>
      </Item>
      <Item>
        <TextContent>
          <Typography variant="h6" component="h2" fontWeight="bold">
            How long does it take to pay off your student loan?
          </Typography>
          <Typography>
            Low income earners usually pay for the full 30 years until their
            student loan is written off. You can observer in the following chart
            how quickly the time required to pay off your student loan reduces
            as the salary increases. It might make sense to make additional
            payments if your salary is at the steepest part of the chart,
            because a small amount can potentially reduce your repayment by many
            years.
          </Typography>
        </TextContent>
        <ChartContainer>
          <Suspense>
            <RepaymentYearsChart />
          </Suspense>
        </ChartContainer>
      </Item>
      <Item>
        <TextContent>
          <Typography variant="h6" component="h2" fontWeight="bold">
            Is it worth paying off student loan early?
          </Typography>
          <Typography>
            You can use the chart below to see what the effective annualized
            interest rate is for different levels of income. You&apos;ll notice
            that the value is lower than the officially stated interest rate,
            this is because as you pay down your student loan you incur less
            interest which reduces the overall interest rate. In conclusion, if
            you believe you can make a better return somewhere else, such as the
            stock market or in real estate, then you will be financially better
            off to invest than to pay down your student loan early.
          </Typography>
        </TextContent>
        <ChartContainer>
          <Suspense
            fallback={<Skeleton variant="rounded" width="100%" height="100%" />}
          >
            <InterestRateChart />
          </Suspense>
        </ChartContainer>
      </Item>
    </Container>
  );
}
