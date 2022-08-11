import {
  InputAdornment,
  InputBaseComponentProps,
  TextField,
} from '@mui/material';
import { forwardRef } from 'react';
import NumberFormat from 'react-number-format';

interface PercentageInputProps {
  id: string;
  label: string;
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
}

export function PercentageInput({
  id,
  label,
  value,
  onChange,
}: PercentageInputProps) {
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      // This typing is correct as the number comes from `NumberFormat`
      onChange={
        onChange as unknown as React.ChangeEventHandler<
          HTMLInputElement | HTMLTextAreaElement
        >
      }
      fullWidth
      variant="outlined"
      inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
      InputProps={{
        inputComponent: NumberFormatCustom,
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
    />
  );
}

const NumberFormatCustom = forwardRef(function NumberFormatCustom(
  props: Omit<InputBaseComponentProps, 'defaultValue' | 'onChange'> & {
    onChange: React.Dispatch<React.SetStateAction<number>>;
  },
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        if (typeof values.floatValue === 'number') {
          onChange?.(values.floatValue);
        }
      }}
      thousandSeparator
      isNumericString
    />
  );
});
