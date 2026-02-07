"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { useDebouncedFunction } from "@/hooks/useDebouncedFunction";
import { cn } from "@/lib/utils";

function Slider({
  className,
  onValueCommitted,
  ...props
}: SliderPrimitive.Root.Props) {
  // Workaround: @base-ui/react v1.1.0 fires onValueCommitted multiple times
  // per touch drag (dual touchend + pointerup listeners). Debounce to dedup.
  // Remove once the upstream bug is fixed, and re-apply if regenerating this
  // shadcn component.
  const debouncedCommit = useDebouncedFunction(
    (...args: Parameters<NonNullable<typeof onValueCommitted>>) => {
      onValueCommitted?.(...args);
    },
    50,
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className,
      )}
      onValueCommitted={debouncedCommit}
      {...props}
    >
      <SliderPrimitive.Control className="flex w-full items-center py-2">
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-input">
          <SliderPrimitive.Indicator className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
