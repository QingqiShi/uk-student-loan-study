/**
 * Base props shared by all input components.
 */
interface BaseInputProps {
  /** Unique identifier for the input element */
  id: string;
  /** Label displayed above the input (optional for inline layouts) */
  label?: string;
  /** Optional helper text displayed below the input */
  helperText?: string;
}

/**
 * Props for the CurrencyInput component.
 */
export interface CurrencyInputProps extends BaseInputProps {
  /** Current value in GBP (empty string for blank input) */
  value: number | "";
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Callback when input loses focus */
  onBlur?: () => void;
}

/**
 * Props for the PercentageInput component.
 */
export interface PercentageInputProps extends Omit<
  BaseInputProps,
  "helperText"
> {
  /** Current value as a percentage (e.g., 6.5 for 6.5%) */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
}

/**
 * Props for the DateInput component.
 */
export interface DateInputProps extends BaseInputProps {
  /** Current date value */
  value: Date | null;
  /** Callback when date changes */
  onChange: (value: Date | null) => void;
}

/**
 * Props for numeric format custom input components.
 * Used internally by CurrencyInput and PercentageInput.
 */
export interface NumericFormatInputProps {
  /** Callback when numeric value changes */
  onChange: (value: number) => void;
}
