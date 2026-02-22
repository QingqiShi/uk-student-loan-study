import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("font-display tracking-tight", {
  variants: {
    size: {
      "page-hero": "text-3xl font-bold text-balance sm:text-4xl lg:text-5xl",
      page: "text-2xl font-bold sm:text-3xl",
      section: "text-xl font-semibold sm:text-2xl",
      subsection: "text-lg font-semibold",
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
