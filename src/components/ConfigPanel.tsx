import { lazy, Suspense } from 'react';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Skeleton,
  Typography,
} from '@mui/material';
import { useStore } from '../store';

const CurrencyInput = lazy(() => import('./CurrencyInput'));
const PercentageInput = lazy(() => import('./PercentageInput'));
const DateInput = lazy(() => import('./DateInput'));

export function ConfigPanel() {
  const store = useStore();

  return (
    <div>
      <Card>
        <Box p={2}>
          <Typography>Student Loan Balance</Typography>
        </Box>
        <Box p={2} display="flex" flexDirection="column" gap={2}>
          <Suspense
            fallback={<Skeleton variant="rounded" width="100%" height={56} />}
          >
            <CurrencyInput
              id="plan2-balance"
              label="Plan 2 Loan Balance"
              value={store.plan2Balance}
              onChange={store.setPlan2Balance}
            />
          </Suspense>
          <Suspense
            fallback={<Skeleton variant="rounded" width="100%" height={56} />}
          >
            <CurrencyInput
              id="postgrad-balance"
              label="Postgraduate Loan Balance"
              value={store.postGradBalance}
              onChange={store.setPostGradBalance}
            />
          </Suspense>
          <Suspense
            fallback={<Skeleton variant="rounded" width="100%" height={56} />}
          >
            <DateInput
              id="repayment-date"
              label="Date Repayment Started"
              value={store.repaymentDate}
              onChange={store.setRepaymentDate}
            />
          </Suspense>
        </Box>
      </Card>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="rates-content"
          id="rates-header"
        >
          <Typography>Rates</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" gap={2}>
            <Suspense
              fallback={<Skeleton variant="rounded" width="100%" height={56} />}
            >
              <PercentageInput
                id="plan2-lt-rate"
                label="Plan 2 Lower Threshold Rate"
                value={store.plan2LTRate}
                onChange={store.setPlan2LTRate}
              />
            </Suspense>
            <Suspense
              fallback={<Skeleton variant="rounded" width="100%" height={56} />}
            >
              <PercentageInput
                id="plan2-ut-rate"
                label="Plan 2 Upper Threshold Rate"
                value={store.plan2UTRate}
                onChange={store.setPlan2UTRate}
              />
            </Suspense>
            <Suspense
              fallback={<Skeleton variant="rounded" width="100%" height={56} />}
            >
              <PercentageInput
                id="postgrad-rate"
                label="Postgraduate Rate"
                value={store.postGradRate}
                onChange={store.setPostGradRate}
              />
            </Suspense>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="employment-content"
          id="employment-header"
        >
          <Typography>Earnings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" gap={2}>
            <Suspense
              fallback={<Skeleton variant="rounded" width="100%" height={56} />}
            >
              <CurrencyInput
                id="earning"
                label="Your current Pre-Tax Salary"
                value={store.salary}
                onChange={store.setSalary}
              />
            </Suspense>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
