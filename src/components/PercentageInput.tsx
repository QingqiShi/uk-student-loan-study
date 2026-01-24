import { forwardRef } from 'react';
import {
  InputAdornment,
  InputBaseComponentProps,
  TextField,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import type { PercentageInputProps } from '../types';

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
      fullWidth
      variant="outlined"
      inputProps={{
        inputMode: 'decimal',
        pattern: '[0-9]*',
        onNumericChange: onChange,
      }}
      InputProps={{
        inputComponent: NumericFormatCustom,
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
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
        thousandSeparator
        valueIsNumericString
      />
    );
  }
);

export default PercentageInput;
