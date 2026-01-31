import { NumericFormat } from "react-number-format";
import type { PercentageInputProps } from "@/types/input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PercentageInput({
  id,
  label,
  value,
  onChange,
}: PercentageInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <NumericFormat
          id={id}
          value={value}
          onValueChange={(values) => {
            if (typeof values.floatValue === "number") {
              onChange(values.floatValue);
            }
          }}
          customInput={CustomInput}
          className="pr-7"
          thousandSeparator
          valueIsNumericString
          inputMode="decimal"
        />
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground">
          %
        </span>
      </div>
    </div>
  );
}

function CustomInput({
  ref,
  ...props
}: React.ComponentProps<"input"> & { ref?: React.Ref<HTMLInputElement> }) {
  return <Input ref={ref} {...props} />;
}

export default PercentageInput;
