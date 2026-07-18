import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Brand hex constants — the two fixed spruce tones used in the icon and logo. */
export const BRAND_HEX = {
  green: "#0C5C44", // deep spruce — the hill (matches --primary light)
  emerald: "#34B08A", // bright spruce — the ground (matches --primary dark)
} as const;

const brandIconVariants = cva("relative overflow-hidden", {
  variants: {
    size: {
      xs: "size-4 rounded-sm",
      sm: "size-6 rounded-md",
      md: "size-8 rounded-lg",
      default: "size-11 rounded-xl",
      lg: "size-12 rounded-xl",
      xl: "size-14 rounded-2xl",
      "2xl": "size-16 rounded-2xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type BrandIconSize = NonNullable<
  VariantProps<typeof brandIconVariants>["size"]
>;

interface BrandIconProps {
  size?: BrandIconSize;
  className?: string;
}

export function BrandIcon({ size = "default", className }: BrandIconProps) {
  return (
    <div
      className={cn(brandIconVariants({ size, className }))}
      style={{ backgroundColor: BRAND_HEX.emerald }}
    >
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="absolute inset-0 size-full"
      >
        <path
          d="M44 44l0-20q-11-16-22-12-11 5-22 16l0 16z"
          fill={BRAND_HEX.green}
        />
      </svg>
    </div>
  );
}
