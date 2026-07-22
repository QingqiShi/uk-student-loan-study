---
name: Student Loan Study
description: UK student-loan repayment shown as a calibrated instrument — the middle-earner truth, sourced from GOV.UK.
colors:
  paper: "#F1F3F2"
  surface: "#FAFBFA"
  sunk: "#E7EBE9"
  ink: "#131B18"
  soft: "#4F5955"
  faint: "#656E68"
  hair: "#DBE1DE"
  grid: "#E4E9E7"
  accent: "#0C5C44"
  accent-ink: "#094A37"
  accent-wash: "#EAF1EE"
  on-accent: "#F5FAF7"
  signal: "#8b3014"
  signal-wash: "#F6EAE6"
typography:
  display:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.032em"
  headline:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.011em"
  body:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.06em"
  readout:
    fontFamily: "Martian Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "clamp(1.28rem, 1.5vw, 1.6rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tabular-nums"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "14px"
  pill: "999px"
spacing:
  gap-tight: "0.5rem"
  gap: "1rem"
  gap-loose: "clamp(1.4rem, 2.2vw, 2rem)"
  bleed: "clamp(1.15rem, 4.2vw, 5rem)"
  section: "clamp(2.6rem, 5vw, 5.5rem)"
components:
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "clamp(1rem, 1.5vw, 1.35rem)"
  metric-cell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.readout}"
    padding: "0.9rem 1rem 1rem"
  metric-cell-hover:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink}"
  scenario-preset:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.soft}"
    rounded: "9px"
    padding: "0.5rem 0.7rem"
  scenario-preset-selected:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.accent-ink}"
    rounded: "9px"
    padding: "0.5rem 0.7rem"
  chip-status:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.soft}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.34rem 0.55rem"
  button-share:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 0.8rem"
    height: "34px"
  button-icon:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.soft}"
    rounded: "{rounded.md}"
    height: "34px"
    width: "34px"
---

# Design System: Student Loan Study

This spec captures the **Instrument** redesign — the approved homepage prototype for studentloanstudy.uk, a single-page UK student-loan repayment calculator. It is the canonical visual system for new screens. Colors are stated as light-theme values (the default); the dark theme is defined token-for-token alongside and noted per color.

## 1. Overview

**Creative North Star: "The Instrument"**

The page is a calibrated measuring instrument, not a marketing site. Its whole job is trust: a middle earner should read the numbers and believe them, because the surface behaves like a spec sheet from a lab bench, not a fintech landing page. Every figure is a live readout; every panel is a framed dial; every claim is sourced to GOV.UK in the same breath it is made. The thesis it exists to prove — _middle earners repay the most_ — is uncomfortable, so the delivery has to be scrupulously plain. Restraint here is not minimalism for taste; it is the argument.

The system is dense and quiet. It layers tone (paper → surface → sunk) and draws structure with 1px hairlines and two heavy 2px ink rules (the nameplate and the footer) that bracket the instrument like the top and bottom edges of a device. There is exactly one brand color — spruce green — carrying every affordance, and exactly one signal color — clay — reserved for the costly peak. Type does the rest of the work: Archivo for language, Martian Mono for the numeric readout, and a hard rule that the two never trade places.

It explicitly rejects the two reflexes it was built against. First-order: the fintech-SaaS hero-metric template (giant gradient number, glass cards, purple accents) — none of it appears. Second-order, and more important: the editorial-typographic reflex (display-serif headline, ruled columns, and a _uniform uppercase-mono wash_ over every label). An earlier pass wore that costume; it was stripped. Labels are sans, sentence-case metadata is sans, and mono is quarantined to the figures. That single decision is what keeps this out of the "AI made that" bucket.

**Key Characteristics:**

- One brand color (spruce `#0C5C44`), one signal color (clay `#8b3014`), everything else tonal neutral.
- Monospace is figures only; every word, including labels, is Archivo.
- Flat surfaces; depth comes from hairlines and tonal layering, not drop shadows.
- Cool, spruce-biased neutrals — never a warm cream/paper ground.
- Both themes designed at the token level with equal care; nothing is a naive invert.
- Sourcing is on the surface: "GOV.UK sourced" and "Updated May 2026" ride the hero, not the fine print.

## 2. Colors

A cool, spruce-biased neutral field with a single green brand voice and a single clay signal. The neutrals carry a faint accent-hue bias so they read as chosen, not as default grey.

### Primary

- **Spruce** (`#0C5C44`; dark `#34B08A`): The brand and the only affordance color. Slider fill, selected-preset wash, the brand mark, sparkline strokes, link underlines, focus rings, the "your salary" dot. If something is interactive or on-brand, it is spruce.
- **Spruce Ink** (`#094A37`; dark `#50C99F`): A stronger spruce for text that must read as a link or an emphasised label against the surface (the "Total repaid" key, inline "change" links, deeplinks). Spruce carries fills; Spruce Ink carries type.

### Secondary

- **Clay** (`#8b3014`; dark `#e26845`): The single signal color. Reserved for cost — the peak of the curve, the interest segment, the "up" delta on a lever. Its rarity is the entire point; it means _this is what the loan costs you_.

### Neutral

- **Ink** (`#131B18`; dark `#E7EEEA`): Primary text and the two 2px bracketing rules (nameplate underline, footer top).
- **Soft** (`#4F5955`; dark `#909A95`): Secondary text — labels, metadata, dek, captions. Contrast-checked against surface for body legibility.
- **Faint** (`#656E68`; dark `#808983`): Tertiary — the subordinated `£` sign, chevrons at rest, axis hatching.
- **Paper** (`#F1F3F2`; dark `#0B1210`): The page ground. Cool near-white, never warm.
- **Surface** (`#FAFBFA`; dark `#0F1815`): Panels, cards, inputs, chips — one step up from paper.
- **Sunk** (`#E7EBE9`; dark `#08100D`): Recessed tracks (slider, bars) and the metric-cell hover — one step down from surface.
- **Hair** (`#DBE1DE`; dark `#1E2A25`): Every 1px divider, panel border, and the gap-grid seams inside the readout.
- **Grid** (`#E4E9E7`; dark `#18231F`): Chart gridlines only, one notch fainter than hair.

### Wash tints

- **Accent Wash** (`color-mix(accent 8%, surface)`): Selected scenario-preset background. Spruce made barely present.
- **Signal Wash** (`color-mix(signal 10%, surface)`): Reserved tint for a cost callout; used sparingly.

### Named Rules

**The Spruce-Only Rule.** There is one accent hue. No second brand color, no gradients, no per-section palettes. Affordance is spruce; if a new element needs to signal "interactive," it turns spruce, it does not introduce a color.

**The One-Signal Rule.** Clay is the cost color and nothing else. It appears on the peak marker, the interest segment, and upward (worse) deltas. It is never decoration, never a heading color, never a hover. On any given screen it should cover well under 10% of the surface — its scarcity is what makes "this is expensive" legible.

## 3. Typography

**Display / Body Font:** Archivo (with `system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`)
**Readout Font:** Martian Mono (with `ui-monospace, SF Mono, Menlo, Consolas, monospace`)

Both are embedded as base64 `@font-face` data URIs so they load with zero network under a strict CSP — never linked from a font CDN. Archivo is a grotesque American-gothic: institutional, slightly compressed, authoritative — the right voice for "here is the hard truth." Martian Mono is a mechanical, low-contrast monospace whose figures read as an engineered readout, not "text in a code font." They contrast on the sans/mono axis, so they never blur into a same-but-different pairing.

**Character:** Archivo states the case; Martian Mono reads the meter. The whole personality lives in keeping those two jobs separate.

### Hierarchy

- **Display** (Archivo 700, `clamp(2rem, 3.4vw, 3.5rem)`, line-height 1.03, `-0.032em`): The h1 thesis only. `text-wrap: balance`, `max-width: 20ch`. Emphasis via a spruce-ink `<em>` (upright, not italic).
- **Headline** (Archivo 700, `clamp(1.5rem, 2.4vw, 2.1rem)`, line-height 1.1, `-0.022em`): Section headings (`h2.sec`).
- **Title** (Archivo 600, `1.0625rem`, `-0.011em`): List-item titles — rule names, tool links, lever names, readout `ctx`.
- **Body** (Archivo 400, `0.9375rem`–`1rem`, line-height 1.5–1.55): Supporting prose. Measures capped 46–60ch (`text-wrap: pretty`).
- **Label** (Archivo 600, `0.75rem`, `0.06em`, UPPERCASE): The single engraved-label treatment — panel/field labels and the status chip. One size, one weight, one tracking.
- **Readout** (Martian Mono 600, `clamp(1.28rem, 1.5vw, 1.6rem)` up to a `clamp(1.5rem, 1.85vw, 1.95rem)` hero step, `-0.02em`, tabular-nums): Every figure that the slider changes — totals, timelines, rates, deltas, the salary value, axis ticks.

### Named Rules

**The Figures-Are-Mono Rule.** Martian Mono is reserved for numeric readouts. Every word — including uppercase labels — is Archivo. Never set a label or a sentence in mono, and never set a figure in sans. This one boundary is the system's signature; breaking it collapses the instrument back into the rejected uppercase-mono wash.

**The Subordinated-Unit Rule.** In a figure, the digits are the subject. The `£` sign drops to `0.64em` in Faint (`.cur`); unit words ("years", "/ year") drop to `0.58em` sans in Soft (`.unit`). `£114,526` reads with the number dominant and the currency deferential.

**The Four-Weight Rule.** Only 400 / 500 / 600 / 700 exist. Middle weights (620, 650) render identically to their neighbours on non-Apple fallbacks, so they are banned — hierarchy comes from size and color, not from weights that don't survive the fallback stack.

## 4. Elevation

Flat by doctrine. The system conveys depth through **tonal layering** and **hairlines**, not shadows. Three ground tones stack (paper → surface → sunk) to place an element in front of or behind its neighbour, and 1px `Hair` borders draw every edge. The only shadow in the system is the panel's near-invisible lift, and it exists to detach the instrument frame from the page by a hair, not to float it.

### Shadow Vocabulary

- **Panel lift** (`box-shadow: 0 1px 0 rgba(19,27,24,.03), 0 14px 34px -30px rgba(19,27,24,.20)`; dark `0 1px 0 rgba(0,0,0,.3), 0 22px 46px -34px rgba(0,0,0,.7)`): The instrument frame only. A tight top hairline plus a very soft, very offset ambient pool — visible as separation, not as a drop shadow.
- **Thumb / control** (`0 1px 3px rgba(0,0,0,.25)`): The slider thumb, so it reads as a physical control above its track. The only other place a shadow is allowed.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. If you reach for a shadow to separate two things, use a tone step or a 1px hairline instead. Shadows are for the panel frame and the slider thumb — nothing else earns one.

**The Bracket Rule.** The page is bracketed by two 2px `Ink` rules — the nameplate's bottom border and the footer's top border — like the top and bottom edges of a device chassis. Everything between them is drawn with 1px hairlines. Do not add more heavy rules; two is the frame.

## 5. Components

Lead with the character, then the spec. Every interactive element resolves to spruce; every figure inside is Martian Mono.

### Instrument Panel

- **Character:** The framed dial. The signature container — the chart and any first-class readout live inside one.
- **Shape:** 14px radius (`{rounded.xl}`), 1px `Hair` border, `Surface` background, the panel-lift shadow. Padding `clamp(1rem, 1.5vw, 1.35rem)`.
- **Caption rail:** A `panel-cap` row — sans meta title on the left ("Fig. 1 — Lifetime repaid by salary · Plan 2"), a mono `peakval` in `Signal` on the right ("Peak £124,361").

### Readout (the four-quadrant breakdown)

- **Character:** The spec sheet. ONE bordered panel split by 1px gap-seams into four metric quadrants (Total repaid / Payoff timeline / Interest / Effective rate) — never four separate cards.
- **Structure:** `display: grid` with `gap: 1px` over a `Hair` background so the seams read as etched dividers; 12px outer radius, `overflow: hidden`.
- **Each quadrant:** an engraved `label` key + a chevron, a Martian Mono value (`Total` steps up to the hero size and spruce-ink; `Interest` is clay), then a differentiated live viz pinned to the baseline (a sparkline, a principal/interest split-bar, or a rate benchmark) so all four align.
- **States:** whole quadrant is a link (drill-down). Hover/focus → `Sunk` background, key turns spruce-ink, chevron turns spruce and nudges +2px. Focus-visible → inset 2px spruce ring.

### Buttons

- **Share button** (`button-share`): `Surface` fill, `Ink` text, 1px `Hair` border, 8px radius, 34px tall. Hover → border to `Soft`. Copied state → spruce-ink text and spruce border.
- **Icon button** (`button-icon`): 34×34, 8px radius, `Soft` icon, `Hair` border. Hover → icon to `Ink`, border to `Soft`. Holds the theme toggle.
- **Tap targets:** both use an invisible `::before { inset: -5px }` to reach a 44px hit area without visual bulk. Preserve this when reimplementing.
- **Note:** the system has no filled "primary" button — primary actions are the drill-down readout cells and the scenario presets. Do not introduce a solid spruce CTA button without a deliberate reason; it would out-shout the instrument.

### Scenario presets (selectable)

- **Character:** Named salary presets plus one "Tailor to you" option; a compact selectable button-card.
- **Style:** `Surface` fill, 1px `Hair` border, 9px radius, `Soft` text with a bold `Ink` value line. Hover → border to `Soft`.
- **Selected** (`aria-pressed="true"`): border to spruce, background to `Accent Wash`, value line to spruce-ink.
- **Responsive:** a container query on the group re-flows the grid 2 → 4 → 5 columns; "Tailor to you" spans full-width until there is room for a single 5-across row.

### Status chip (`chip-status`)

- **Style:** `Surface` fill, 1px `Hair` border, 6px radius, engraved `label` type in `Soft`, a 6px spruce dot. Carries provenance ("GOV.UK sourced").

### Salary slider

- **Track:** 6px pill; the filled portion is a spruce→sunk hard-stop gradient driven by a `--fill` custom property (JS updates it on input).
- **Thumb:** 18px `Surface` disc with a 3px spruce ring and the control shadow. Hover → scale 1.14; active → scale 1.06 with a deeper shadow. The one place scale-on-hover is used.
- **Value:** Martian Mono, right-aligned, updates live with the subordinated-unit treatment.

### Chart (signature instrument)

- **Character:** The thesis, drawn. An SVG area+line of lifetime-repaid-by-salary with a spruce curve, a faint `Grid` graticule, a dashed `Signal` peak marker, and a spruce "your salary" dot.
- **Ticks:** Martian Mono, hidden below 760px. Captions: Archivo 600 in `Soft`.
- **Motion:** a one-time draw-in on first load (`slsDraw` stroke reveal + `slsFade` area), disabled under reduced-motion. No scroll-triggered per-section reveals anywhere.

### Editorial sections (rules / levers / tools)

- **Character:** Not cards. Content is separated by space and a numbered index alone — no boxes, no side-stripes.
- **Rules:** a `mono` spruce index (`01`…) beside a titled paragraph; a real enumerated set, which is the only reason numbering is allowed.
- **Levers:** a name, a mono delta on the right (spruce for "down/better", clay for "up/worse"), and a thin proportion bar.
- **Tools:** a linked index — bold title, spruce arrow that slides +3px on hover, a dek beneath.

## 6. Do's and Don'ts

### Do:

- **Do** keep Martian Mono for figures only, and set every word — labels included — in Archivo. (The Figures-Are-Mono Rule.)
- **Do** subordinate the `£` sign (`.cur`) and unit words (`.unit`) so the digit is the subject of every figure.
- **Do** use `font-variant-numeric: tabular-nums` on every figure the slider changes, so digits don't jitter as they update.
- **Do** reserve clay `#8b3014` for cost — the peak, interest, worse deltas — and let spruce `#0C5C44` carry every affordance.
- **Do** draw structure with 1px `Hair` dividers and the two 2px `Ink` bracket rules; keep surfaces flat and layer tone (paper → surface → sunk) for depth.
- **Do** keep the four-metric breakdown as ONE panel split by 1px seams, each quadrant carrying its own differentiated viz.
- **Do** design both themes at the token level — cool near-white + spruce, deep spruce-black + mint — with equal care; never a naive invert.
- **Do** keep provenance on the surface (GOV.UK sourced, updated date) — trust is the page's first job.

### Don't:

- **Don't** set labels or sentences in monospace, and don't set figures in sans — the uniform uppercase-mono wash is the exact editorial reflex this redesign stripped out.
- **Don't** add a second accent hue, a gradient, or gradient text (`background-clip: text`). One brand color, one signal color.
- **Don't** use glassmorphism or decorative drop shadows; the only shadows are the panel lift and the slider thumb.
- **Don't** wrap the four metrics in four separate cards, and never nest a card inside a card — the readout is a single quadrant panel.
- **Don't** use side-stripe borders (a `border-left` > 1px as a colored accent) on any callout or list item.
- **Don't** add tiny uppercase tracked eyebrows above every section, or `01 / 02 / 03` numbered markers as scaffolding. Numbering is earned only where the content is a genuine enumerated set (the "rules" index).
- **Don't** use a warm cream / sand / paper ground; the neutrals are cool and spruce-biased by design.
- **Don't** put grey or `Soft` text on the spruce brand mark or any spruce fill — use `On-Accent` (`#F5FAF7`).
- **Don't** introduce a solid spruce "primary" CTA button that out-shouts the instrument; primary actions are the readout drill-cells and presets.
