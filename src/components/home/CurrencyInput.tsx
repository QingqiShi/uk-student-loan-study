import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CurrencyInputProps } from "@/types/input";

export function CurrencyInput({
  id,
  label,
  helperText,
  value,
  onChange,
  onBlur,
}: CurrencyInputProps) {
  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
          £
        </span>
        <NumericFormat
          id={id}
          value={value}
          onValueChange={(values) => {
            if (typeof values.floatValue === "number") {
              onChange(values.floatValue);
            }
          }}
          onBlur={onBlur}
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

/**
 * `react-number-format`'s `customInput` slot: it owns the value and the ref, so
 * the app's `<Input>` is wrapped rather than rendered directly.
 */
export function CustomInput({
  ref,
  ...props
}: React.ComponentProps<"input"> & { ref?: React.Ref<HTMLInputElement> }) {
  return <Input ref={ref} {...props} />;
}
