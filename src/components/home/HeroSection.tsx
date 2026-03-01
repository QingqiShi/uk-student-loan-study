import { Heading } from "@/components/typography/Heading";

export function HeroSection() {
  return (
    <div className="space-y-2">
      <Heading as="h1" size="page-hero">
        Student Loan <span className="text-primary">Repayment Calculator</span>
      </Heading>
      <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
        Middle earners pay the most on UK student loans. See where you fall.
      </p>
    </div>
  );
}
