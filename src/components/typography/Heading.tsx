import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Instrument identity: headings are Archivo, sentence case, bold, tracked in.
// One face, weight does the work — no separate poster/display face, no uppercase
// masthead. Fluid sizes come from real `--text-*` tokens defined in globals.
const headingVariants = cva("font-sans text-balance text-foreground", {
  variants: {
    size: {
      "page-hero": "text-hero font-bold tracking-hero",
      page: "text-page font-bold tracking-heading",
      section: "text-section font-bold tracking-heading",
      subsection: "text-lead font-semibold tracking-tight text-balance",
    },
  },
  defaultVariants: {
    size: "page",
  },
});

type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

function Heading({
  as: Tag = "h2",
  size,
  className,
  ...props
}: React.ComponentProps<"h1"> &
  VariantProps<typeof headingVariants> & {
    as?: HeadingElement;
  }) {
  return (
    <Tag
      data-slot="heading"
      className={cn(headingVariants({ size, className }))}
      {...props}
    />
  );
}

export { Heading, headingVariants };
