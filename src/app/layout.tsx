import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Manrope, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ViewTransition } from "react";
import "./globals.css";
import type { Metadata } from "next";
import { AssumptionsWizardProvider } from "@/context/AssumptionsWizardContext";
import { LoanProvider } from "@/context/LoanContext";
import { PersonalizedResultsProvider } from "@/context/PersonalizedResultsContext";
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
    default:
      "UK Student Loan Repayment Calculator — Are You Paying More Than You Should?",
    template: "%s | UK Student Loan Study",
  },
  description:
    "Free UK student loan repayment calculator for Plan 1, 2, 4, 5 and Postgraduate loans. See how long to pay off your student loan, total repayments, and monthly costs. Middle earners pay the most — find out where you fall.",
  keywords: [
    "student loan repayment calculator",
    "UK student loan calculator",
    "student loan calculator UK",
    "how long to pay off student loan",
    "student loan payoff calculator",
    "UK student loan",
    "Plan 2 student loan",
    "Plan 5 student loan",
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
  name: "UK Student Loan Repayment Calculator",
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
      </head>
      <body>
        <ThemeProvider>
          <LoanProvider>
            <AssumptionsWizardProvider>
              <PersonalizedResultsProvider>
                <ViewTransition>{children}</ViewTransition>
              </PersonalizedResultsProvider>
            </AssumptionsWizardProvider>
          </LoanProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
