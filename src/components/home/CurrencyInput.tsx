import { NumericFormat } from "react-number-format";
import type { CurrencyInputProps } from "@/types/input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

function CustomInput({
  ref,
  ...props
}: React.ComponentProps<"input"> & { ref?: React.Ref<HTMLInputElement> }) {
  return <Input ref={ref} {...props} />;
}

export default CurrencyInput;
