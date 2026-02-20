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
