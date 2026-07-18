import { cn } from "@/lib/utils";

/**
 * A numeric readout. Sets figures in the tabular mono face so every £ and %
 * across the site aligns column-wise and reads like an instrument display —
 * this is the site's core personality lever (it's a numbers tool), applied
 * wherever a meaningful figure is shown.
 *
 * Pass `children` for the default treatment: a mono/tabular `<span>`.
 *
 * Pass `value` to render a preformatted figure string in the subordinated
 * readout treatment instead — a leading "£" is dropped to a small `.cur` and a
 * trailing unit word ("total", "years", "year") drops to a small sans `.unit`,
 * so the digits stay the subject. In this mode the component renders a bare
 * fragment (no wrapper), inheriting the caller's mono/tabular container.
 *
 * @example <Figure>{currencyFormatter.format(total)}</Figure>
 * @example <Figure value="£124k total" />  → £ · 124k · total
 * @example <Figure value="30 years" />      → 30 · years
 * @example <Figure value="5.5%" />          → 5.5%
 */
function Figure({
  value,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { value?: string }) {
  if (value !== undefined) {
    const trimmed = value.trim();
    const hasCurrency = trimmed.startsWith("£");
    let body = hasCurrency ? trimmed.slice(1) : trimmed;

    let unit: string | null = null;
    const lastSpace = body.lastIndexOf(" ");
    if (lastSpace !== -1) {
      const tail = body.slice(lastSpace + 1);
      if (/^[A-Za-z]+$/.test(tail)) {
        unit = tail;
        body = body.slice(0, lastSpace);
      }
    }

    return (
      <>
        {hasCurrency && (
          <span className="mr-[0.05em] text-[0.64em] font-medium tracking-normal text-faint">
            £
          </span>
        )}
        {body}
        {unit && (
          <span className="ml-[0.22em] font-sans text-[0.58em] font-medium tracking-[0.01em] text-muted-foreground">
            {unit}
          </span>
        )}
      </>
    );
  }

  return (
    <span
      data-slot="figure"
      className={cn("font-mono tracking-tight tabular-nums", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { Figure };
