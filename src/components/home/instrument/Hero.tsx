import { VerifiedAgo } from "@/components/instrument/VerifiedAgo";
import { Heading } from "@/components/typography/Heading";

export function Hero() {
  return (
    <div className="[grid-area:head] md:self-center work:self-start">
      <Heading
        as="h1"
        size="page-hero"
        className="mb-4 max-w-[20ch] work:text-[clamp(2.5rem,2.3vw,3.5rem)]"
      >
        Middle earners repay the{" "}
        <em className="px-[0.04em] text-cta not-italic">most</em>.
      </Heading>
      <p className="mb-[1.1rem] max-w-[48ch] text-[clamp(1.02rem,1.15vw,1.2rem)] leading-[1.55] text-pretty text-muted-foreground md:mb-[1.4rem]">
        The UK student loan is sold as a fair deal. On a middle income it’s a
        real, expensive debt — see where you land on the curve.
      </p>
      <p className="flex flex-wrap items-center gap-x-[0.65rem] gap-y-[0.4rem] font-sans text-meta text-muted-foreground">
        <span className="font-bold text-primary">✓</span> Independent{" "}
        <span className="text-faint">·</span> GOV.UK sourced{" "}
        <span className="text-faint">·</span> <VerifiedAgo />
      </p>
    </div>
  );
}
