import type { Metadata } from "next";
import { formatGBP, formatPercent } from "@/lib/format";
import {
  CURRENT_RATES,
  PLAN_CONFIGS,
  PLAN_DISPLAY_INFO,
  POSTGRADUATE_DISPLAY_INFO,
} from "@/lib/loans/plans";

/**
 * Content for the dedicated per-plan SEO pages under /plans.
 *
 * Every monetary figure, rate, and write-off period is DERIVED from
 * src/lib/loans/plans.ts (which the daily GOV.UK automation regenerates).
 * Never hardcode thresholds, rates, or interest figures here.
 */

export type PlanPageKey =
  "PLAN_1" | "PLAN_2" | "PLAN_4" | "PLAN_5" | "POSTGRADUATE";

export interface PlanFaq {
  question: string;
  answer: string;
}

export interface PlanPageContent {
  key: PlanPageKey;
  slug: string;
  /** Full display name, e.g. "Plan 1" or "Postgraduate Loan". */
  name: string;
  /** Short label used in tables/badges, e.g. "Plan 1" or "Postgraduate". */
  shortName: string;
  region: string;
  years: string;
  monthlyThreshold: number;
  yearlyThreshold: number;
  repaymentRate: number;
  writeOffYears: number;
  /** One-line description of how interest is charged. */
  interestShort: string;
  /** The interest rate that applies right now, e.g. "3.2%". */
  interestCurrent: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroIntro: string;
  whatItIs: string[];
  whoItIsFor: string[];
  interestParagraphs: string[];
  compareParagraph: string;
  middleEarner: string;
  faqs: PlanFaq[];
}

/** Fixed left-to-right order for the hub grid, comparison table, and cards. */
export const PLAN_PAGE_ORDER: PlanPageKey[] = [
  "PLAN_1",
  "PLAN_2",
  "PLAN_4",
  "PLAN_5",
  "POSTGRADUATE",
];

const SITE_URL = "https://studentloanstudy.uk";

/** Builds Next.js route metadata for a per-plan page from its content. */
export function buildPlanMetadata(key: PlanPageKey): Metadata {
  const plan = PLAN_PAGES[key];
  const url = `${SITE_URL}/plans/${plan.slug}`;
  return {
    title: plan.metaTitle,
    description: plan.metaDescription,
    keywords: plan.keywords,
    alternates: { canonical: `/plans/${plan.slug}` },
    openGraph: {
      title: plan.metaTitle,
      description: plan.metaDescription,
      url,
      type: "article",
    },
  };
}

/** BreadcrumbList JSON-LD (Home › Loan Plans › <Plan>) for a per-plan page. */
export function planBreadcrumbSchema(key: PlanPageKey) {
  const plan = PLAN_PAGES[key];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Loan Plans",
        item: `${SITE_URL}/plans`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${plan.name} student loan`,
        item: `${SITE_URL}/plans/${plan.slug}`,
      },
    ],
  };
}

/** FAQPage JSON-LD built from a plan's on-page FAQs. */
export function planFaqSchema(key: PlanPageKey) {
  const plan = PLAN_PAGES[key];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: plan.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

const { rpi, boeBaseRate } = CURRENT_RATES;

// Current effective rates derived from the live figures in plans.ts.
const cappedRate = Math.min(rpi, boeBaseRate + 1); // Plan 1 & Plan 4
const plan2LowRate = rpi;
const plan2HighRate = rpi + 3;
const postgradRate = rpi + 3;

const plan2InterestLower = PLAN_CONFIGS.PLAN_2.interestLowerThreshold;
const plan2InterestUpper = PLAN_CONFIGS.PLAN_2.interestUpperThreshold;

const rpiPct = formatPercent(rpi);
const basePlusOnePct = formatPercent(boeBaseRate + 1);
const cappedPct = formatPercent(cappedRate);
const plan2LowPct = formatPercent(plan2LowRate);
const plan2HighPct = formatPercent(plan2HighRate);
const postgradPct = formatPercent(postgradRate);

const p1 = PLAN_DISPLAY_INFO.PLAN_1;
const p2 = PLAN_DISPLAY_INFO.PLAN_2;
const p4 = PLAN_DISPLAY_INFO.PLAN_4;
const p5 = PLAN_DISPLAY_INFO.PLAN_5;
const pg = POSTGRADUATE_DISPLAY_INFO;

const p1MonthlyGBP = formatGBP(PLAN_CONFIGS.PLAN_1.monthlyThreshold);
const p2MonthlyGBP = formatGBP(PLAN_CONFIGS.PLAN_2.monthlyThreshold);
const p4MonthlyGBP = formatGBP(PLAN_CONFIGS.PLAN_4.monthlyThreshold);
const p5MonthlyGBP = formatGBP(PLAN_CONFIGS.PLAN_5.monthlyThreshold);
const pgMonthlyGBP = formatGBP(PLAN_CONFIGS.POSTGRADUATE.monthlyThreshold);

const p1YearGBP = formatGBP(p1.yearlyThreshold);
const p2YearGBP = formatGBP(p2.yearlyThreshold);
const p4YearGBP = formatGBP(p4.yearlyThreshold);
const p5YearGBP = formatGBP(p5.yearlyThreshold);
const pgYearGBP = formatGBP(pg.yearlyThreshold);

const p1Rate = formatPercent(p1.repaymentRate * 100);
const pgRatePct = formatPercent(pg.repaymentRate * 100);

const p1WriteOff = String(p1.writeOffYears);
const p2WriteOff = String(p2.writeOffYears);
const p4WriteOff = String(p4.writeOffYears);
const p5WriteOff = String(p5.writeOffYears);
const pgWriteOff = String(pg.writeOffYears);

export const PLAN_PAGES: Record<PlanPageKey, PlanPageContent> = {
  PLAN_1: {
    key: "PLAN_1",
    slug: "plan-1",
    name: "Plan 1",
    shortName: "Plan 1",
    region: p1.region,
    years: p1.years,
    monthlyThreshold: PLAN_CONFIGS.PLAN_1.monthlyThreshold,
    yearlyThreshold: p1.yearlyThreshold,
    repaymentRate: p1.repaymentRate,
    writeOffYears: p1.writeOffYears,
    interestShort: "Lower of RPI or base rate + 1%",
    interestCurrent: cappedPct,
    metaTitle:
      "What Is a Plan 1 Student Loan? Threshold, Interest & Write-Off (2026)",
    metaDescription: `Plan 1 student loans: ${p1YearGBP} repayment threshold, ${p1Rate} rate, capped interest (${cappedPct} now) and a ${p1WriteOff}-year write-off. Who's on Plan 1 and how it compares.`,
    keywords: [
      "what is plan 1 student loan",
      "plan 1 student loan",
      "plan 1 student loan threshold",
      "plan 1 student loan interest rate",
      "plan 1 repayment threshold",
      "plan 1 write off",
    ],
    heroIntro: `Plan 1 is the oldest UK student loan type still being repaid. It covers English and Welsh students who started before September 2012, and every Northern Irish student regardless of start year. You repay ${p1Rate} of everything you earn above ${p1YearGBP} a year, and any balance left after ${p1WriteOff} years is written off.`,
    whatItIs: [
      `A Plan 1 student loan is repaid at ${p1Rate} of your income above the ${p1YearGBP}-a-year (${p1MonthlyGBP} a month) repayment threshold. It has the lowest interest of any plan because the rate is capped at the lower of RPI or the Bank of England base rate plus 1%.`,
      `Because Plan 1 is the oldest plan, many borrowers are now well into their ${p1WriteOff}-year term. Any remaining balance is written off once that period is reached, with nothing left to pay.`,
    ],
    whoItIsFor: [
      "You are on Plan 1 if you are an English or Welsh student who started an undergraduate course before September 2012.",
      "You are also on Plan 1 if you are a Northern Irish student, whenever you started — Northern Ireland kept Plan 1 rather than moving to Plan 2 or Plan 5.",
    ],
    interestParagraphs: [
      `Plan 1 interest is charged at the lower of RPI (${rpiPct}) or the Bank of England base rate plus 1% (${basePlusOnePct}). Right now that works out at ${cappedPct}.`,
      `This cap keeps Plan 1 interest low and predictable — it never runs away the way a purely inflation-linked rate can, which makes Plan 1 the cheapest plan to carry pound for pound.`,
    ],
    compareParagraph: `Plan 1 has a lower threshold than Plan 2 (${p2YearGBP}) or Plan 4 (${p4YearGBP}), so you start repaying earlier, but its capped interest and shorter ${p1WriteOff}-year write-off make it far cheaper over a lifetime than the newer ${p5WriteOff}-year Plan 5.`,
    middleEarner: `Plan 1's low, capped interest means the balance rarely balloons, so the middle-earner trap that hits Plan 2 and Plan 5 borrowers is much weaker here. The people most likely to pay off a Plan 1 loan in full are steady middle earners — low earners often reach the ${p1WriteOff}-year write-off first, while high earners pay it off quickly. Model your own salary to see where you land.`,
    faqs: [
      {
        question: "What is a Plan 1 student loan?",
        answer: `Plan 1 is a UK undergraduate loan for English and Welsh students who started before September 2012, and for all Northern Irish students. You repay ${p1Rate} of income above ${p1YearGBP} a year, interest is capped at the lower of RPI or base rate + 1% (currently ${cappedPct}), and any balance is written off after ${p1WriteOff} years.`,
      },
      {
        question: "What is the Plan 1 repayment threshold?",
        answer: `The Plan 1 threshold is ${p1YearGBP} a year (${p1MonthlyGBP} a month). You repay ${p1Rate} of everything you earn above it, so on Plan 1 someone earning below ${p1YearGBP} makes no repayments at all.`,
      },
      {
        question: "What is the Plan 1 interest rate?",
        answer: `Plan 1 interest is the lower of RPI (${rpiPct}) or the Bank of England base rate plus 1% (${basePlusOnePct}), which currently means ${cappedPct}. It is the lowest interest rate of any UK student loan plan.`,
      },
      {
        question: "When is a Plan 1 loan written off?",
        answer: `A Plan 1 loan is written off ${p1WriteOff} years after the April you were first due to repay. Anything still outstanding at that point no longer has to be repaid, and you stop paying.`,
      },
    ],
  },
  PLAN_2: {
    key: "PLAN_2",
    slug: "plan-2",
    name: "Plan 2",
    shortName: "Plan 2",
    region: p2.region,
    years: p2.years,
    monthlyThreshold: PLAN_CONFIGS.PLAN_2.monthlyThreshold,
    yearlyThreshold: p2.yearlyThreshold,
    repaymentRate: p2.repaymentRate,
    writeOffYears: p2.writeOffYears,
    interestShort: "RPI to RPI + 3% (sliding scale)",
    interestCurrent: `${plan2LowPct}–${plan2HighPct}`,
    metaTitle:
      "What Is a Plan 2 Student Loan? Threshold, Interest & Write-Off (2026)",
    metaDescription: `Plan 2 student loans: ${p2YearGBP} threshold, ${p1Rate} rate, a sliding scale from ${plan2LowPct} to ${plan2HighPct}, and a ${p2WriteOff}-year write-off. Why middle earners repay the most.`,
    keywords: [
      "what is plan 2 student loan",
      "plan 2 student loan",
      "plan 2 student loan threshold",
      "plan 2 student loan interest rate",
      "plan 2 repayment threshold",
      "plan 2 write off",
    ],
    heroIntro: `Plan 2 covers English and Welsh students who started university between September 2012 and July 2023 — the £9,000-plus tuition fee generation. You repay ${p1Rate} of income above ${p2YearGBP} a year, and interest runs on a sliding scale up to RPI + 3%, which is exactly why Plan 2 middle earners so often repay more than anyone else.`,
    whatItIs: [
      `A Plan 2 student loan is repaid at ${p1Rate} of your income above ${p2YearGBP} a year (${p2MonthlyGBP} a month). Unlike Plan 1, interest follows a sliding scale: it climbs from RPI up to RPI + 3% as your salary rises.`,
      `Any balance still outstanding ${p2WriteOff} years after you were first due to repay is written off. But because of the high interest, most Plan 2 borrowers never reach a zero balance through minimum repayments alone.`,
    ],
    whoItIsFor: [
      "You are on Plan 2 if you are an English or Welsh student who started an undergraduate course between 1 September 2012 and 31 July 2023.",
      "English students who started from September 2023 onwards are on Plan 5 instead. Welsh students who started after August 2023 stay on Plan 2, because Plan 5 is England-only.",
    ],
    interestParagraphs: [
      `Plan 2 interest is charged on a sliding scale. While you are studying, and on income up to ${p2YearGBP}, you pay RPI (${rpiPct}). Between ${formatGBP(plan2InterestLower)} and ${formatGBP(plan2InterestUpper)} the rate rises linearly, reaching RPI + 3% (${plan2HighPct}) once you earn ${formatGBP(plan2InterestUpper)} or more.`,
      `That RPI + 3% ceiling is the single biggest reason Plan 2 is so expensive: the balance can grow faster than a typical borrower repays it, so it keeps compounding for years.`,
    ],
    compareParagraph: `Plan 2 has a higher threshold than Plan 1 (${p1YearGBP}) or Plan 5 (${p5YearGBP}), so you repay less each month at the same salary — but its RPI + 3% interest ceiling makes it the most expensive plan for middle earners, more than offsetting the shorter ${p2WriteOff}-year term versus Plan 5's ${p5WriteOff} years.`,
    middleEarner: `Plan 2 is the clearest example of the middle-earner trap. Low earners repay little and reach the ${p2WriteOff}-year write-off with plenty written off; high earners pay off the balance fast before much interest builds. It is the middle — graduates earning enough to make real repayments, but not enough to outrun RPI + 3% interest — who repay the most in total, often far more than they originally borrowed.`,
    faqs: [
      {
        question: "What is a Plan 2 student loan?",
        answer: `Plan 2 is a UK undergraduate loan for English and Welsh students who started between September 2012 and July 2023. You repay ${p1Rate} of income above ${p2YearGBP} a year, interest runs from RPI (${rpiPct}) up to RPI + 3% (${plan2HighPct}) depending on income, and any balance is written off after ${p2WriteOff} years.`,
      },
      {
        question: "What is the Plan 2 repayment threshold?",
        answer: `The Plan 2 threshold is ${p2YearGBP} a year (${p2MonthlyGBP} a month) — the highest of the England/Wales undergraduate plans. You repay ${p1Rate} of everything above it.`,
      },
      {
        question: "What is the Plan 2 interest rate?",
        answer: `Plan 2 interest follows a sliding scale, from RPI (${rpiPct}) at or below ${formatGBP(plan2InterestLower)} up to RPI + 3% (${plan2HighPct}) at ${formatGBP(plan2InterestUpper)} or more, interpolated in between. A separate cap can lower the headline rate when market rates are low.`,
      },
      {
        question: "Why do Plan 2 middle earners repay the most?",
        answer: `Because Plan 2 interest reaches RPI + 3%, middle earners repay steadily but not fast enough to stop the balance compounding, and they earn too much for the ${p2WriteOff}-year write-off to help. High earners pay off the loan quickly; low earners have it written off — so the middle pays the most in total.`,
      },
    ],
  },
  PLAN_4: {
    key: "PLAN_4",
    slug: "plan-4",
    name: "Plan 4",
    shortName: "Plan 4",
    region: p4.region,
    years: p4.years,
    monthlyThreshold: PLAN_CONFIGS.PLAN_4.monthlyThreshold,
    yearlyThreshold: p4.yearlyThreshold,
    repaymentRate: p4.repaymentRate,
    writeOffYears: p4.writeOffYears,
    interestShort: "Lower of RPI or base rate + 1%",
    interestCurrent: cappedPct,
    metaTitle:
      "What Is a Plan 4 Student Loan? Threshold, Interest & Write-Off (2026)",
    metaDescription: `Plan 4 is the Scottish student loan: ${p4YearGBP} threshold — the highest of any plan — ${p1Rate} rate, capped interest (${cappedPct} now) and a ${p4WriteOff}-year write-off.`,
    keywords: [
      "what is plan 4 student loan",
      "plan 4 student loan",
      "scottish student loan",
      "plan 4 student loan threshold",
      "plan 4 student loan interest rate",
      "plan 4 write off",
    ],
    heroIntro: `Plan 4 is the loan for Scottish students. It has the highest repayment threshold of any UK plan — ${p4YearGBP} a year — so you keep more of your salary before repayments start. Interest is capped at the lower of RPI or base rate + 1%, and any balance is written off after ${p4WriteOff} years.`,
    whatItIs: [
      `A Plan 4 student loan is repaid at ${p1Rate} of income above ${p4YearGBP} a year (${p4MonthlyGBP} a month), the highest threshold of any plan. Interest is capped at the lower of RPI or the Bank of England base rate plus 1%.`,
      `Plan 4 replaced the old Scottish "Plan 1" arrangement in 2021, but it applies to Scottish students across all start years. Any balance is written off ${p4WriteOff} years after you became due to repay.`,
    ],
    whoItIsFor: [
      "You are on Plan 4 if you took out an undergraduate student loan from the Student Awards Agency Scotland (SAAS) as a Scottish student.",
      "Plan 4 applies regardless of when you studied — Scotland moved existing Scottish borrowers onto Plan 4 terms, including its higher repayment threshold.",
    ],
    interestParagraphs: [
      `Plan 4 interest is charged at the lower of RPI (${rpiPct}) or the Bank of England base rate plus 1% (${basePlusOnePct}), currently ${cappedPct} — the same low, capped approach as Plan 1.`,
      `Combined with the highest threshold of any plan, this makes Plan 4 one of the gentler loans to repay: you start later and the balance grows slowly.`,
    ],
    compareParagraph: `Plan 4's ${p4YearGBP} threshold is higher than Plan 1 (${p1YearGBP}), Plan 2 (${p2YearGBP}) or Plan 5 (${p5YearGBP}), so at the same salary you repay the least each month. Its capped interest also keeps it far cheaper over time than Plan 5's ${p5WriteOff}-year RPI-linked loan.`,
    middleEarner: `Because Plan 4 pairs the highest threshold with capped interest, the middle-earner squeeze is milder than on Plan 2 or Plan 5. Still, borrowers who earn steadily above ${p4YearGBP} for decades can repay a large share of their loan, while lower earners reach the ${p4WriteOff}-year write-off first. See where your salary falls.`,
    faqs: [
      {
        question: "What is a Plan 4 student loan?",
        answer: `Plan 4 is the UK student loan plan for Scottish students. You repay ${p1Rate} of income above ${p4YearGBP} a year — the highest threshold of any plan — interest is capped at the lower of RPI or base rate + 1% (currently ${cappedPct}), and any balance is written off after ${p4WriteOff} years.`,
      },
      {
        question: "What is the Plan 4 repayment threshold?",
        answer: `The Plan 4 threshold is ${p4YearGBP} a year (${p4MonthlyGBP} a month), the highest of any UK student loan plan. You repay ${p1Rate} of everything you earn above it.`,
      },
      {
        question: "What is the Plan 4 interest rate?",
        answer: `Plan 4 interest is the lower of RPI (${rpiPct}) or the Bank of England base rate plus 1% (${basePlusOnePct}), currently ${cappedPct} — the same capped rate as Plan 1.`,
      },
      {
        question: "Who is on Plan 4?",
        answer: `Scottish students who borrowed through the Student Awards Agency Scotland are on Plan 4, across all start years. It replaced the previous Scottish arrangement and carries the highest repayment threshold of any plan.`,
      },
    ],
  },
  PLAN_5: {
    key: "PLAN_5",
    slug: "plan-5",
    name: "Plan 5",
    shortName: "Plan 5",
    region: p5.region,
    years: p5.years,
    monthlyThreshold: PLAN_CONFIGS.PLAN_5.monthlyThreshold,
    yearlyThreshold: p5.yearlyThreshold,
    repaymentRate: p5.repaymentRate,
    writeOffYears: p5.writeOffYears,
    interestShort: "RPI only",
    interestCurrent: rpiPct,
    metaTitle:
      "What Is a Plan 5 Student Loan? Threshold, Interest & Write-Off (2026)",
    metaDescription: `Plan 5 student loans: ${p5YearGBP} threshold, ${p1Rate} rate, RPI-only interest (${rpiPct} now) and a ${p5WriteOff}-year write-off. Who's on Plan 5 and why the long term costs middle earners.`,
    keywords: [
      "what is plan 5 student loan",
      "plan 5 student loan",
      "plan 5 student loan threshold",
      "plan 5 student loan interest rate",
      "plan 5 repayment threshold",
      "plan 5 write off",
    ],
    heroIntro: `Plan 5 is the newest UK student loan, for English students who started university from September 2023 onwards. It has the lowest threshold of the current undergraduate plans — ${p5YearGBP} a year — the simplest interest (RPI only), but the longest write-off of any plan at ${p5WriteOff} years.`,
    whatItIs: [
      `A Plan 5 student loan is repaid at ${p1Rate} of income above ${p5YearGBP} a year (${p5MonthlyGBP} a month). Interest is charged at RPI only — no sliding scale — which makes the balance easier to predict than Plan 2.`,
      `The catch is the term: Plan 5 balances are written off ${p5WriteOff} years after you become due to repay, ten years longer than Plan 2 and fifteen longer than Plan 1. That extra decade of repayments is where the real cost hides.`,
    ],
    whoItIsFor: [
      "You are on Plan 5 if you are an English student who started an undergraduate course on or after 1 August 2023.",
      "Welsh, Scottish and Northern Irish students are not on Plan 5 — Plan 5 is England-only. Students who started before August 2023 remain on Plan 2 (or Plan 1).",
    ],
    interestParagraphs: [
      `Plan 5 interest is charged at RPI only — currently ${rpiPct} — with no sliding scale. That makes it the simplest interest of any plan to understand and forecast.`,
      `Lower, simpler interest sounds cheaper, but the ${p5WriteOff}-year write-off means most borrowers keep repaying for far longer, so many end up paying more in total than they would have on the shorter Plan 2.`,
    ],
    compareParagraph: `Plan 5's ${p5YearGBP} threshold is lower than Plan 2 (${p2YearGBP}), so you start repaying sooner and pay more each month at the same salary. Its RPI-only interest is gentler than Plan 2's RPI + 3%, but the ${p5WriteOff}-year term (versus ${p2WriteOff} for Plan 2) is longer than any other plan.`,
    middleEarner: `Plan 5's ${p5WriteOff}-year term turns the middle-earner trap into a marathon. Lower earners can pay for four decades and still have a balance written off; high earners pay it off early. Middle earners repay steadily for most of their working life — often paying back far more than they borrowed before the write-off ever arrives.`,
    faqs: [
      {
        question: "What is a Plan 5 student loan?",
        answer: `Plan 5 is the newest UK student loan, for English students who started from September 2023. You repay ${p1Rate} of income above ${p5YearGBP} a year, interest is RPI only (currently ${rpiPct}), and any balance is written off after ${p5WriteOff} years — the longest term of any plan.`,
      },
      {
        question: "What is the Plan 5 repayment threshold?",
        answer: `The Plan 5 threshold is ${p5YearGBP} a year (${p5MonthlyGBP} a month), the lowest of the current undergraduate plans. You repay ${p1Rate} of everything you earn above it, so repayments start at a lower salary than on Plan 2.`,
      },
      {
        question: "What is the Plan 5 student loan interest rate?",
        answer: `Plan 5 interest is charged at RPI only, currently ${rpiPct}, with no sliding scale. That is simpler and lower than Plan 2's RPI + 3% ceiling, but the ${p5WriteOff}-year write-off can make Plan 5 more expensive overall.`,
      },
      {
        question: "When is a Plan 5 loan written off?",
        answer: `A Plan 5 loan is written off ${p5WriteOff} years after the April you were first due to repay — ten years longer than Plan 2 and fifteen longer than Plan 1. That long term is the main driver of Plan 5's lifetime cost.`,
      },
    ],
  },
  POSTGRADUATE: {
    key: "POSTGRADUATE",
    slug: "postgraduate",
    name: "Postgraduate Loan",
    shortName: "Postgraduate",
    region: pg.region,
    years: pg.years,
    monthlyThreshold: PLAN_CONFIGS.POSTGRADUATE.monthlyThreshold,
    yearlyThreshold: pg.yearlyThreshold,
    repaymentRate: pg.repaymentRate,
    writeOffYears: pg.writeOffYears,
    interestShort: "RPI + 3%",
    interestCurrent: postgradPct,
    metaTitle:
      "What Is a Postgraduate Loan? Threshold, Interest & Write-Off (2026)",
    metaDescription: `Postgraduate Master's & Doctoral loans: ${pgYearGBP} threshold, ${pgRatePct} rate, RPI + 3% interest (${postgradPct} now) and a ${pgWriteOff}-year write-off. How it stacks alongside your undergraduate loan.`,
    keywords: [
      "what is a postgraduate loan",
      "postgraduate student loan",
      "postgraduate loan threshold",
      "postgraduate loan interest rate",
      "masters loan repayment",
      "postgraduate loan write off",
    ],
    heroIntro: `The Postgraduate Loan funds Master's and Doctoral study across the UK. It works differently from the undergraduate plans: you repay ${pgRatePct} (not 9%) of income above ${pgYearGBP} a year, interest is a flat RPI + 3%, and the balance is written off after ${pgWriteOff} years.`,
    whatItIs: [
      `A Postgraduate Loan is repaid at ${pgRatePct} of income above ${pgYearGBP} a year (${pgMonthlyGBP} a month). The threshold is the lowest of any plan, and interest is a flat RPI + 3% regardless of your salary.`,
      `Crucially, a Postgraduate Loan is repaid alongside — not instead of — any undergraduate loan. If you hold both, the deductions stack, so a graduate on Plan 2 plus a Postgraduate Loan can face two repayments at once.`,
    ],
    whoItIsFor: [
      "You are on a Postgraduate Loan if you borrowed for a Master's or Doctoral course from Student Finance anywhere in the UK from 2016 onwards.",
      "It sits on top of any undergraduate plan you already have. Your undergraduate loan keeps its own threshold, rate and write-off — the Postgraduate Loan is calculated separately.",
    ],
    interestParagraphs: [
      `Postgraduate Loan interest is a flat RPI + 3% — currently ${postgradPct} — for everyone, whatever you earn. There is no sliding scale like Plan 2 and no cap like Plan 1 or Plan 4.`,
      `That makes it one of the higher interest rates in the system, so the balance grows quickly. Combined with the ${pgWriteOff}-year term, many postgraduate borrowers repay well beyond what they originally borrowed.`,
    ],
    compareParagraph: `The Postgraduate Loan has the lowest threshold (${pgYearGBP}) but the lowest repayment rate (${pgRatePct} versus 9%). Its flat RPI + 3% interest matches Plan 2's ceiling, and because it stacks on top of an undergraduate loan, the combined deductions can be heavier than any single plan.`,
    middleEarner: `Postgraduate borrowers feel the middle-earner squeeze twice over: the ${pgRatePct} postgraduate deduction stacks on top of a 9% undergraduate deduction, while RPI + 3% interest keeps both balances growing. Middle earners with two loans running at once can lose a meaningful slice of every pay rise. Model the combined effect to see it clearly.`,
    faqs: [
      {
        question: "What is a Postgraduate Loan?",
        answer: `A Postgraduate Loan funds Master's and Doctoral study in the UK. You repay ${pgRatePct} of income above ${pgYearGBP} a year, interest is a flat RPI + 3% (currently ${postgradPct}), and the balance is written off after ${pgWriteOff} years. It is repaid alongside any undergraduate loan.`,
      },
      {
        question: "What is the Postgraduate Loan threshold?",
        answer: `The Postgraduate Loan threshold is ${pgYearGBP} a year (${pgMonthlyGBP} a month), the lowest of any plan. You repay ${pgRatePct} of everything above it — a lower rate than the 9% charged on undergraduate plans.`,
      },
      {
        question: "What is the Postgraduate Loan interest rate?",
        answer: `Postgraduate Loan interest is a flat RPI + 3% for everyone, currently ${postgradPct}. Unlike Plan 2 there is no sliding scale, and unlike Plan 1 and Plan 4 there is no low-rate cap.`,
      },
      {
        question:
          "Do I repay a Postgraduate Loan and an undergraduate loan at the same time?",
        answer: `Yes. A Postgraduate Loan is repaid on top of any undergraduate plan, not instead of it. Each has its own threshold and rate, so if you hold both you make two separate deductions — ${pgRatePct} above ${pgYearGBP} for the postgraduate loan plus 9% above your undergraduate threshold.`,
      },
    ],
  },
};
