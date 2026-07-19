import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Heading } from "@/components/typography/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { surfaceCard } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { BrandIcon, BRAND_HEX, type BrandIconSize } from "./BrandIcon";
import { BrandLogo } from "./BrandLogo";

// The two-colour functional system — the whole Instrument palette in one idea:
// one spruce carries brand and affordance, one clay marks cost and peak.
const SEMANTIC = [
  {
    name: "Spruce",
    token: "--primary",
    role: "Brand, affordance, and every positive reading — links, actions, the paid-down curve.",
  },
  {
    name: "Clay",
    token: "--signal",
    role: "Cost only. Interest, the peak of the balance, the number that hurts. Used sparingly.",
  },
] as const;

const BRAND_SWATCHES = [
  { name: "Spruce", hex: BRAND_HEX.green },
  { name: "Mint", hex: BRAND_HEX.emerald },
];

const ICON_SIZES: BrandIconSize[] = ["2xl", "lg", "md", "xs"];

const CORE_TOKENS = [
  { name: "Background", var: "--background" },
  { name: "Foreground", var: "--foreground" },
  { name: "Card", var: "--card" },
  { name: "Muted", var: "--muted" },
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
  "Icon: a mint square carrying a deep-spruce wave — the peak repayment zone lifted straight from the calculator chart.",
  '"StudentLoan" is set in ink — the context, telling you what the site is about.',
  '"Study" is set in spruce, the single brand colour — the emphasised, memorable word.',
  '".uk" is set in soft grey — the domain, deliberately subordinate to the name.',
];

export function BrandGuidelinesPage() {
  return (
    <PageLayout>
      <div className="space-y-14">
        {/* Header */}
        <header className="space-y-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Brand guidelines</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="space-y-4">
            <Heading as="h1" size="page">
              Brand guidelines
            </Heading>
            <p className="max-w-[68ch] text-lead text-muted-foreground">
              The Instrument system: one spruce, one clay, cool neutrals, and
              two typefaces. Archivo carries every word; Martian Mono is
              reserved for figures. Everything on this page is drawn from the
              live design tokens.
            </p>
          </div>
        </header>

        {/* The two-colour system — the headline of the palette */}
        <Section
          title="Two colours carry meaning"
          lede="Every other surface is a cool neutral. Colour is spent only where it means something."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {SEMANTIC.map((c) => (
              <div key={c.name} className={cn(surfaceCard, "overflow-hidden")}>
                <div
                  className="h-28 w-full"
                  style={{ backgroundColor: `var(${c.token})` }}
                />
                <div className="space-y-2 p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <TokenName>{c.name}</TokenName>
                    <span className="font-mono text-xs text-muted-foreground">
                      {c.token}
                    </span>
                  </div>
                  <p className="text-sm/relaxed text-muted-foreground">
                    {c.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Primary Logo */}
        <Section title="Primary logo">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Eyebrow as="span" marker={false}>
                On dark
              </Eyebrow>
              <div
                className={cn(
                  surfaceCard,
                  "dark flex items-center justify-center p-8",
                )}
              >
                <BrandLogo />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Eyebrow as="span" marker={false}>
                On light
              </Eyebrow>
              <div
                className={cn(
                  surfaceCard,
                  "light flex items-center justify-center p-8",
                )}
              >
                <BrandLogo />
              </div>
            </div>
          </div>
        </Section>

        {/* Icon / Favicon */}
        <Section title="Icon / favicon">
          <div
            className={cn(surfaceCard, "flex flex-wrap items-end gap-8 p-6")}
          >
            {ICON_SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <BrandIcon size={size} />
                <span className="text-xs text-muted-foreground">{size}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Colours */}
        <Section
          title="Colour tokens"
          lede="The full token set behind the two-colour system — neutrals, semantic status, and the per-series chart ramp."
        >
          <div className="space-y-10">
            {/* Brand marks */}
            <div>
              <SubgroupLabel>Brand marks</SubgroupLabel>
              <p className="mt-1 mb-4 max-w-[60ch] text-sm text-muted-foreground">
                The two fixed spruce tones baked into the logo and icon.
              </p>
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

            {/* Neutrals */}
            <div>
              <SubgroupLabel>Neutrals</SubgroupLabel>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {CORE_TOKENS.map((token) => (
                  <TokenSwatch
                    key={token.var}
                    name={token.name}
                    varName={token.var}
                  />
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <SubgroupLabel>Status</SubgroupLabel>
              <p className="mt-1 mb-4 max-w-[60ch] text-sm text-muted-foreground">
                Non-brand utility tokens for system messaging — deliberately
                outside the two-colour thesis.
              </p>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {STATUS_GROUPS.map((group) => (
                  <div key={group.name} className="space-y-3">
                    <TokenName>{group.name}</TokenName>
                    <div className="grid grid-cols-3 gap-2">
                      {group.tokens.map((token) => (
                        <div key={token.label} className="flex flex-col gap-2">
                          <div
                            className="h-10 w-full rounded-md border border-border"
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
              <SubgroupLabel>Chart series</SubgroupLabel>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {CHART_TOKENS.map((token) => (
                  <TokenSwatch
                    key={token.var}
                    name={token.name}
                    varName={token.var}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Typography */}
        <Section
          title="Typography"
          lede="Two faces, one rule: words are Archivo, figures are Martian Mono. Nothing crosses over."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FontShowcase
              name="Archivo"
              usage="Display, headings, body, every label"
              weights="400 · 500 · 600 · 700"
              fontFamily="var(--font-sans), 'Archivo', system-ui, sans-serif"
              sampleWeight={700}
            />
            <FontShowcase
              name="Martian Mono"
              usage="Numeric readouts — figures only"
              weights="400 · 500 · 600"
              fontFamily="var(--font-mono), 'Martian Mono', ui-monospace, monospace"
              sampleWeight={600}
              sample="1234"
              mono
            />
          </div>
        </Section>

        {/* Logo Anatomy */}
        <Section title="Logo anatomy">
          <div className={cn(surfaceCard, "flex items-center gap-3.5 p-8")}>
            <BrandLogo size="xl" />
          </div>
          <ul className="mt-6 space-y-3">
            {LOGO_ANATOMY.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-sm bg-primary" />
                <span className="max-w-[68ch] text-sm/relaxed text-muted-foreground">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </PageLayout>
  );
}

function Section({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <Heading as="h2" size="section">
          {title}
        </Heading>
        {lede && <p className="max-w-[68ch] text-muted-foreground">{lede}</p>}
      </div>
      {children}
    </section>
  );
}

function SubgroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <Eyebrow as="span" marker={false}>
      {children}
    </Eyebrow>
  );
}

/** A token's human name — an Archivo uppercase engraved key, never mono. */
function TokenName({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-xs font-semibold tracking-wider text-foreground uppercase">
      {children}
    </span>
  );
}

function TokenSwatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="h-14 w-full rounded-lg border border-border"
        style={{ backgroundColor: `var(${varName})` }}
      />
      <div className="flex flex-col gap-0.5">
        <TokenName>{name}</TokenName>
        <span className="font-mono text-xs text-muted-foreground">
          {varName}
        </span>
      </div>
    </div>
  );
}

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="h-20 w-full rounded-lg border border-border"
        style={{ backgroundColor: hex }}
      />
      <div className="flex flex-col gap-0.5">
        <TokenName>{name}</TokenName>
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
  sample = "Aa",
  mono = false,
}: {
  name: string;
  usage: string;
  weights: string;
  fontFamily: string;
  sampleWeight: number;
  sample?: string;
  mono?: boolean;
}) {
  return (
    <div className={cn(surfaceCard, "flex flex-col gap-4 p-6")}>
      <span
        className={cn("text-5xl text-foreground", mono && "tabular-nums")}
        style={{ fontFamily, fontWeight: sampleWeight }}
      >
        {sample}
      </span>
      <div className="flex flex-col gap-1">
        <TokenName>{name}</TokenName>
        <span className="text-xs text-muted-foreground">{usage}</span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {weights}
        </span>
      </div>
    </div>
  );
}
