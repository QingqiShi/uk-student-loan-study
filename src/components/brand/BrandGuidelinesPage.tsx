import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { BrandIcon } from "./BrandIcon";
import { BrandLogo } from "./BrandLogo";
import { Card } from "@/components/ui/card";
import { BRAND_COLORS } from "@/lib/brand-colors";

const COLORS = [
  { name: "Primary Green", hex: BRAND_COLORS.primary.light },
  { name: "Dark Green", hex: BRAND_COLORS.primaryDark },
  { name: "Background", hex: BRAND_COLORS.background, hasBorder: true },
  { name: "Muted Text", hex: BRAND_COLORS.muted },
];

const ICON_SIZES = [64, 48, 32, 16];

const LOGO_ANATOMY = [
  "Icon: The curve represents the peak repayment zone from the calculator chart",
  '"StudentLoan" in white provides the context - what the site is about',
  '"Study" in bold green is the action word - the memorable call to action',
  "Subtle green shadow adds depth and reinforces brand color",
];

export function BrandGuidelinesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header variant="simple" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 md:px-6 md:py-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          Back to Calculator
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="font-display text-[32px] font-bold text-foreground">
            Brand Guidelines
          </h1>
          <p className="mt-2 font-display text-base text-muted-foreground">
            studentloanstudy.uk
          </p>
        </header>

        {/* Divider */}
        <hr className="mb-12 border-border" />

        {/* Section: Primary Logo */}
        <Section title="PRIMARY LOGO">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Dark background */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] text-muted-foreground">On Dark</span>
              <Card className="flex items-center justify-center bg-zinc-900 p-8 dark:bg-zinc-900">
                <BrandLogo variant="dark" />
              </Card>
            </div>
            {/* Light background */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] text-muted-foreground">
                On Light
              </span>
              <Card className="flex items-center justify-center bg-white p-8 dark:bg-white">
                <BrandLogo variant="light" />
              </Card>
            </div>
          </div>
        </Section>

        {/* Section: Icon / Favicon */}
        <Section title="ICON / FAVICON">
          <div className="flex flex-wrap items-end gap-6">
            {ICON_SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <BrandIcon size={size} />
                <span className="text-[10px] text-muted-foreground">
                  {size}px
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Section: Color Palette */}
        <Section title="COLOR PALETTE">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {COLORS.map((color) => (
              <ColorSwatch
                key={color.name}
                name={color.name}
                hex={color.hex}
                hasBorder={color.hasBorder}
              />
            ))}
          </div>
        </Section>

        {/* Section: Typography */}
        <Section title="TYPOGRAPHY">
          <div className="grid gap-8 md:grid-cols-2">
            <FontShowcase
              name="Space Grotesk"
              usage="Logo, Headings"
              weights="Weights: 400, 700"
              fontFamily="var(--font-display), 'Space Grotesk', sans-serif"
              sampleWeight={700}
            />
            <FontShowcase
              name="Manrope"
              usage="Body, UI Elements"
              weights="Weights: 400, 500, 600, 700"
              fontFamily="var(--font-sans), 'Manrope', sans-serif"
              sampleWeight={600}
            />
          </div>
        </Section>

        {/* Section: Logo Anatomy */}
        <Section title="LOGO ANATOMY">
          <Card className="flex items-center gap-3.5 p-8">
            <BrandLogo size="large" />
          </Card>
          <ul className="mt-6 space-y-3">
            {LOGO_ANATOMY.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-sm bg-primary" />
                <span className="text-[13px] leading-relaxed text-muted-foreground">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-[11px] font-bold tracking-[2px] text-primary uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ColorSwatch({
  name,
  hex,
  hasBorder,
}: {
  name: string;
  hex: string;
  hasBorder?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={`h-20 w-full rounded-[10px] ring-1 ring-border ${hasBorder ? "border border-border" : ""}`}
        style={{ backgroundColor: hex }}
      />
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-[13px] font-semibold text-foreground">
          {name}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {hex}
        </span>
      </div>
    </div>
  );
}

function FontShowcase({
  name,
  usage,
  weights,
  fontFamily,
  sampleWeight,
}: {
  name: string;
  usage: string;
  weights: string;
  fontFamily: string;
  sampleWeight: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span
        className="text-5xl text-foreground"
        style={{ fontFamily, fontWeight: sampleWeight }}
      >
        Aa
      </span>
      <div className="flex flex-col gap-1">
        <span className="font-display text-sm font-semibold text-foreground">
          {name}
        </span>
        <span className="text-xs text-muted-foreground">{usage}</span>
        <span className="text-[11px] text-muted-foreground/70">{weights}</span>
      </div>
    </div>
  );
}
