import { BrandIcon, BRAND_HEX } from "./BrandIcon";
import { BrandLogo } from "./BrandLogo";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BRAND_SWATCHES = [
  { name: "Primary Green", hex: BRAND_HEX.green },
  { name: "Primary Emerald", hex: BRAND_HEX.emerald },
];

const ICON_SIZES = [64, 48, 32, 16];

const CORE_TOKENS = [
  { name: "Primary", var: "--primary" },
  { name: "Secondary", var: "--secondary" },
  { name: "Muted", var: "--muted" },
  { name: "Accent", var: "--accent" },
  { name: "Destructive", var: "--destructive" },
  { name: "Background", var: "--background" },
  { name: "Foreground", var: "--foreground" },
  { name: "Card", var: "--card" },
  { name: "Border", var: "--border" },
];

const STATUS_GROUPS = [
  {
    name: "Info",
    tokens: [
      { label: "Foreground", var: "--status-info-foreground" },
      { label: "Background", var: "--status-info" },
      { label: "Border", var: "--status-info-border" },
    ],
  },
  {
    name: "Success",
    tokens: [
      { label: "Foreground", var: "--status-success-foreground" },
      { label: "Background", var: "--status-success" },
      { label: "Border", var: "--status-success-border" },
    ],
  },
  {
    name: "Warning",
    tokens: [
      { label: "Foreground", var: "--status-warning-foreground" },
      { label: "Background", var: "--status-warning" },
      { label: "Border", var: "--status-warning-border" },
    ],
  },
  {
    name: "Danger",
    tokens: [
      { label: "Foreground", var: "--status-danger-foreground" },
      { label: "Background", var: "--status-danger" },
      { label: "Border", var: "--status-danger-border" },
    ],
  },
];

const CHART_TOKENS = [
  { name: "Chart 1", var: "--chart-1" },
  { name: "Chart 2", var: "--chart-2" },
  { name: "Chart 3", var: "--chart-3" },
  { name: "Chart 4", var: "--chart-4" },
  { name: "Chart 5", var: "--chart-5" },
];

const LOGO_ANATOMY = [
  "Icon: The curve represents the peak repayment zone from the calculator chart",
  '"StudentLoan" in white provides the context - what the site is about',
  '"Study" in bold green is the action word - the memorable call to action',
  "Subtle green shadow adds depth and reinforces brand color",
];

export function BrandGuidelinesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="mb-8">
          <Breadcrumb currentTitle="Brand Guidelines" />
        </div>

        {/* Header */}
        <header className="mb-12">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Brand Guidelines
          </h1>
          <p className="mt-2 font-display text-base text-muted-foreground">
            studentloanstudy.uk
          </p>
        </header>

        {/* Divider */}
        <Separator className="mb-12" />

        {/* Section: Primary Logo */}
        <Section title="PRIMARY LOGO">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Dark background */}
            <div className="flex flex-col gap-4">
              <span className="text-xs text-muted-foreground">On Dark</span>
              <Card className="dark flex items-center justify-center p-8">
                <BrandLogo variant="dark" />
              </Card>
            </div>
            {/* Light background */}
            <div className="flex flex-col gap-4">
              <span className="text-xs text-muted-foreground">On Light</span>
              <Card className="light flex items-center justify-center p-8">
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
                <span className="text-xs text-muted-foreground">{size}px</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Section: Colors (consolidated) */}
        <Section title="COLORS">
          <div className="space-y-10">
            {/* Brand */}
            <div>
              <SubgroupLabel>Brand</SubgroupLabel>
              <div className="grid grid-cols-2 gap-4">
                {BRAND_SWATCHES.map((swatch) => (
                  <ColorSwatch
                    key={swatch.name}
                    name={swatch.name}
                    hex={swatch.hex}
                  />
                ))}
              </div>
            </div>

            {/* Core */}
            <div>
              <SubgroupLabel>Core</SubgroupLabel>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {CORE_TOKENS.map((token) => (
                  <div key={token.var} className="flex flex-col gap-3">
                    <div
                      className="h-14 w-full rounded-lg ring-1 ring-border"
                      style={{ backgroundColor: `var(${token.var})` }}
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-display text-sm font-semibold text-foreground">
                        {token.name}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {token.var}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <SubgroupLabel>Status</SubgroupLabel>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {STATUS_GROUPS.map((group) => (
                  <div key={group.name} className="space-y-3">
                    <span className="font-display text-sm font-semibold text-foreground">
                      {group.name}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {group.tokens.map((token) => (
                        <div key={token.label} className="flex flex-col gap-2">
                          <div
                            className="h-10 w-full rounded-md ring-1 ring-border"
                            style={{ backgroundColor: `var(${token.var})` }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {token.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div>
              <SubgroupLabel>Chart</SubgroupLabel>
              <div className="grid grid-cols-5 gap-4">
                {CHART_TOKENS.map((token) => (
                  <div key={token.var} className="flex flex-col gap-3">
                    <div
                      className="h-14 w-full rounded-lg ring-1 ring-border"
                      style={{ backgroundColor: `var(${token.var})` }}
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-display text-sm font-semibold text-foreground">
                        {token.name}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {token.var}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                <span className="text-sm/relaxed text-muted-foreground">
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
      <h2 className="mb-6 text-xs font-bold tracking-widest text-primary uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubgroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 block text-xs font-medium tracking-wider text-muted-foreground uppercase">
      {children}
    </span>
  );
}

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="h-20 w-full rounded-lg ring-1 ring-border"
        style={{ backgroundColor: hex }}
      />
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-sm font-semibold text-foreground">
          {name}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{hex}</span>
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
        <span className="text-xs text-muted-foreground">{weights}</span>
      </div>
    </div>
  );
}
