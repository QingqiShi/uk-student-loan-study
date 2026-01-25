import { NumericFormat } from 'react-number-format';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CurrencyInputProps } from '../types';

export function CurrencyInput({
  id,
  label,
  helperText,
  value,
  onChange,
}: CurrencyInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          £
        </span>
        <NumericFormat
          id={id}
          value={value}
          onValueChange={(values) => {
            if (typeof values.floatValue === 'number') {
              onChange(values.floatValue);
            }
          }}
          customInput={CustomInput}
          className="pl-7"
          decimalScale={2}
          fixedDecimalScale
          thousandSeparator
          valueIsNumericString
          inputMode="decimal"
        />
      </div>
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

function CustomInput({
  ref,
  ...props
}: React.ComponentProps<'input'> & { ref?: React.Ref<HTMLInputElement> }) {
  return <Input ref={ref} {...props} />;
}

export default CurrencyInput;
