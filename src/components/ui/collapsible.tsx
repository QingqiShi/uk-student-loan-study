"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

function Collapsible({ className, ...props }: CollapsiblePrimitive.Root.Props) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function CollapsibleTrigger({
  className,
  children,
  ...props
}: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(
        "focus-visible:ring-ring/50 focus-visible:border-ring group/collapsible-trigger flex w-full items-center justify-between rounded-lg py-2.5 text-left text-sm font-medium transition-all hover:underline focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        strokeWidth={2}
        className="text-muted-foreground pointer-events-none size-4 shrink-0 group-data-open/collapsible-trigger:hidden"
      />
      <HugeiconsIcon
        icon={ArrowUp01Icon}
        strokeWidth={2}
        className="text-muted-foreground pointer-events-none hidden size-4 shrink-0 group-data-open/collapsible-trigger:inline"
      />
    </CollapsiblePrimitive.Trigger>
  );
}

function CollapsibleContent({
  className,
  children,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className="overflow-hidden text-sm data-closed:animate-accordion-up data-open:animate-accordion-down"
      {...props}
    >
      <div
        className={cn(
          "h-(--collapsible-panel-height) pb-2.5 pt-0 data-ending-style:h-0 data-starting-style:h-0",
          className,
        )}
      >
        {children}
      </div>
    </CollapsiblePrimitive.Panel>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
