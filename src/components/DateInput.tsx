import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface DateInputProps {
  id: string;
  label: string;
  value: Date | null;
  onChange: React.Dispatch<React.SetStateAction<Date | null>>;
}

export function DateInput({ id, label, value, onChange }: DateInputProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        InputProps={{ id }}
        label={label}
        renderInput={(params) => <TextField {...params} />}
        value={value}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
}
