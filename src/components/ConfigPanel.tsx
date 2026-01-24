import { lazy, Suspense } from 'react';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Skeleton,
  Switch,
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
              id="undergrad-balance"
              label="Undergraduate Loan Balance (plan 2 or plan 5)"
              value={store.underGradBalance}
              onChange={(value) => store.updateField('underGradBalance', value)}
            />
          </Suspense>
          <Suspense
            fallback={<Skeleton variant="rounded" width="100%" height={56} />}
          >
            <CurrencyInput
              id="postgrad-balance"
              label="Postgraduate Loan Balance"
              value={store.postGradBalance}
              onChange={(value) => store.updateField('postGradBalance', value)}
            />
          </Suspense>
          <Suspense
            fallback={<Skeleton variant="rounded" width="100%" height={56} />}
          >
            <DateInput
              id="repayment-date"
              label="Date Repayment Started"
              helperText="This determines when your loan is written off."
              value={store.repaymentDate}
              onChange={(value) => store.updateField('repaymentDate', value)}
            />
          </Suspense>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  value={store.isPost2023}
                  onChange={(e) => store.updateField('isPost2023', e.target.checked)}
                />
              }
              label="Post 2023"
            />
            <FormHelperText>
              For students who started an undergraduate course on or after
              August 2023.
            </FormHelperText>
          </FormGroup>
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
            {!store.isPost2023 && (
              <>
                <Suspense
                  fallback={
                    <Skeleton variant="rounded" width="100%" height={56} />
                  }
                >
                  <PercentageInput
                    id="plan2-lt-rate"
                    label="Plan 2 Lower Threshold Rate"
                    value={store.plan2LTRate}
                    onChange={(value) => store.updateField('plan2LTRate', value)}
                  />
                </Suspense>
                <Suspense
                  fallback={
                    <Skeleton variant="rounded" width="100%" height={56} />
                  }
                >
                  <PercentageInput
                    id="plan2-ut-rate"
                    label="Plan 2 Upper Threshold Rate"
                    value={store.plan2UTRate}
                    onChange={(value) => store.updateField('plan2UTRate', value)}
                  />
                </Suspense>
              </>
            )}
            {store.isPost2023 && (
              <Suspense
                fallback={
                  <Skeleton variant="rounded" width="100%" height={56} />
                }
              >
                <PercentageInput
                  id="plan5-rate"
                  label="Plan 5 Interest Rate (RPI)"
                  value={store.plan5Rate}
                  onChange={(value) => store.updateField('plan5Rate', value)}
                />
              </Suspense>
            )}
            <Suspense
              fallback={<Skeleton variant="rounded" width="100%" height={56} />}
            >
              <PercentageInput
                id="postgrad-rate"
                label="Postgraduate Rate"
                value={store.postGradRate}
                onChange={(value) => store.updateField('postGradRate', value)}
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
                onChange={(value) => store.updateField('salary', value)}
              />
            </Suspense>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
