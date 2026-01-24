import { forwardRef } from 'react';
import {
  InputAdornment,
  InputBaseComponentProps,
  TextField,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import type { CurrencyInputProps } from '../types';

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
      variant="outlined"
      inputProps={{
        inputMode: 'decimal',
        pattern: '[0-9]*',
        onNumericChange: onChange,
      }}
      InputProps={{
        inputComponent: NumericFormatCustom,
        startAdornment: <InputAdornment position="start">£</InputAdornment>,
      }}
      fullWidth
    />
  );
}

interface NumericFormatCustomProps
  extends Omit<InputBaseComponentProps, 'defaultValue'> {
  onNumericChange?: (value: number) => void;
}

const NumericFormatCustom = forwardRef<HTMLInputElement, NumericFormatCustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onNumericChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          if (typeof values.floatValue === 'number') {
            onNumericChange?.(values.floatValue);
          }
        }}
        decimalScale={2}
        fixedDecimalScale
        thousandSeparator
        valueIsNumericString
      />
    );
  }
);

export default CurrencyInput;
