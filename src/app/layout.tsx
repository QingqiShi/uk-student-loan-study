import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Manrope, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { AssumptionsWizardProvider } from "@/context/AssumptionsWizardContext";
import { LoanProvider } from "@/context/LoanContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studentloanstudy.uk"),
  title: {
    default: "UK Student Loan Study — Are You Paying More Than You Should?",
    template: "%s | UK Student Loan Study",
  },
  description:
    "Middle earners pay the most on student loans — more than high earners, and far more than low earners who get written off. See where you fall and what your loan really costs.",
  keywords: [
    "UK student loan",
    "student loan calculator",
    "Plan 2",
    "Plan 5",
    "student loan repayment",
    "student finance",
    "loan write-off",
  ],
  authors: [{ name: "UK Student Loan Study" }],
  openGraph: {
    siteName: "UK Student Loan Study",
    type: "website",
    locale: "en_GB",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UK Student Loan Study",
  description:
    "Calculate total UK student loan repayments based on salary, balance, and plan type. Compare outcomes across Plan 1, 2, 4, 5, and Postgraduate loans.",
  url: "https://studentloanstudy.uk",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
  },
  about: {
    "@type": "FinancialProduct",
    name: "UK Student Loan",
    category: "Student Loan",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why do middle earners pay the most on UK student loans?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Middle earners often pay the most because high earners pay off their loans quickly (accumulating less interest), while low earners have their remaining debt written off after 25-40 years. Middle earners pay for decades, accumulating significant interest before write-off, often repaying more than the original loan amount.",
      },
    },
    {
      "@type": "Question",
      name: "How much will I repay on my UK student loan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your total repayment depends on your salary, loan balance, and plan type. You repay 9% of income above the threshold (6% for Postgraduate loans). Use our calculator to see your projected total repayment based on your specific situation.",
      },
    },
    {
      "@type": "Question",
      name: "When does my UK student loan get written off?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Write-off periods vary by plan: Plan 1 writes off 25 years after the April you were first due to repay. Plan 2 writes off 30 years after. Plan 4 writes off 30 years after. Plan 5 writes off 40 years after. Postgraduate loans write off 30 years after.",
      },
    },
  ],
};

// Inline script to prevent theme flash on page load
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var resolved = theme;
    if (!theme || theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.add(resolved);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        manrope.variable,
        spaceGrotesk.variable,
        jetbrainsMono.variable,
      )}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <LoanProvider>
            <AssumptionsWizardProvider>{children}</AssumptionsWizardProvider>
          </LoanProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
