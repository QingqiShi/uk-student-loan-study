import { forwardRef } from 'react';
import {
  InputAdornment,
  InputBaseComponentProps,
  TextField,
} from '@mui/material';
import NumberFormat from 'react-number-format';

interface CurrencyInputProps {
  id: string;
  label: string;
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
}: CurrencyInputProps) {
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
      variant="outlined"
      inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
      InputProps={{
        inputComponent: NumberFormatCustom,
        startAdornment: <InputAdornment position="start">£</InputAdornment>,
      }}
      fullWidth
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
      decimalScale={2}
      fixedDecimalScale
      thousandSeparator
      isNumericString
    />
  );
});
