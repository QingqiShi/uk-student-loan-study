import { forwardRef } from 'react';
import {
  InputAdornment,
  InputBaseComponentProps,
  TextField,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';

interface CurrencyInputProps {
  id: string;
  label: string;
  helperText?: string;
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
}

export function CurrencyInput({
  id,
  label,
  helperText,
  value,
  onChange,
}: CurrencyInputProps) {
  return (
    <TextField
      id={id}
      label={label}
      helperText={helperText}
      value={value}
      // This typing is correct as the number comes from `NumericFormat`
      onChange={
        onChange as unknown as React.ChangeEventHandler<
          HTMLInputElement | HTMLTextAreaElement
        >
      }
      variant="outlined"
      inputProps={{ inputMode: 'decimal', pattern: '[0-9]*' }}
      InputProps={{
        inputComponent: NumericFormatCustom,
        startAdornment: <InputAdornment position="start">£</InputAdornment>,
      }}
      fullWidth
    />
  );
}

const NumericFormatCustom = forwardRef(function NumericFormatCustom(
  props: Omit<InputBaseComponentProps, 'defaultValue' | 'onChange'> & {
    onChange: React.Dispatch<React.SetStateAction<number>>;
  },
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
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
      valueIsNumericString
    />
  );
});

export default CurrencyInput;
