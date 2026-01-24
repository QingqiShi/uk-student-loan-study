import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { DateInputProps } from '../types';

export function DateInput({
  id,
  label,
  helperText,
  value,
  onChange,
}: DateInputProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        InputProps={{ id }}
        label={label}
        renderInput={(params) => (
          <TextField {...params} helperText={helperText} />
        )}
        value={value}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
}

export default DateInput;
