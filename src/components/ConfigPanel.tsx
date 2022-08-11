import { useState } from 'react';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Typography,
} from '@mui/material';
import { CurrencyInput } from './CurrencyInput';
import { PercentageInput } from './PercentageInput';
import { DateInput } from './DateInput';
import { useStore } from '../store';

export function ConfigPanel() {
  const store = useStore();

  return (
    <div>
      <Card>
        <Box p={2}>
          <Typography>Student Loan Balance</Typography>
        </Box>
        <Box p={2} display="flex" flexDirection="column" gap={2}>
          <CurrencyInput
            id="plan2-balance"
            label="Plan 2 Loan Balance"
            value={store.plan2Balance}
            onChange={store.setPlan2Balance}
          />
          <CurrencyInput
            id="postgrad-balance"
            label="Postgraduate Loan Balance"
            value={store.postGradBalance}
            onChange={store.setPostGradBalance}
          />
          <DateInput
            id="repayment-date"
            label="Date Repayment Started"
            value={store.repaymentDate}
            onChange={store.setRepaymentDate}
          />
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
            <PercentageInput
              id="plan2-lt-rate"
              label="Plan 2 Lower Threshold Rate"
              value={store.plan2LTRate}
              onChange={store.setPlan2LTRate}
            />
            <PercentageInput
              id="plan2-ut-rate"
              label="Plan 2 Upper Threshold Rate"
              value={store.plan2UTRate}
              onChange={store.setPlan2UTRate}
            />
            <PercentageInput
              id="postgrad-rate"
              label="Postgraduate Rate"
              value={store.postGradRate}
              onChange={store.setPostGradRate}
            />
            <PercentageInput
              id="inflation-rate"
              label="Inflation Rate"
              value={store.inflationRate}
              onChange={store.setInflationRate}
            />
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
            <CurrencyInput
              id="earning"
              label="Your current Pre-Tax Salary"
              value={store.salary}
              onChange={store.setSalary}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
