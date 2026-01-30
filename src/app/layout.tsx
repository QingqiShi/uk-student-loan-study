import { Analytics } from "@vercel/analytics/react";
import { Manrope } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "UK Student Loan Study - Student Loan Repayment Calculator",
  description:
    "Interactive calculator to understand UK student loan repayment. Compare Plan 2 and Plan 5, visualize total repayments, and see effective interest rates based on your salary.",
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
    title: "UK Student Loan Study",
    description:
      "Interactive calculator to understand UK student loan repayment under Plan 2, Plan 5, and Postgraduate schemes.",
    url: "https://studentloanstudy.uk",
    siteName: "UK Student Loan Study",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Student Loan Study",
    description:
      "Interactive calculator to understand UK student loan repayment under Plan 2, Plan 5, and Postgraduate schemes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UK Student Loan Study",
  description:
    "Interactive calculator to understand UK student loan repayment under Plan 2, Plan 5, and Postgraduate schemes.",
  url: "https://studentloanstudy.uk",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
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
    <html lang="en" className={cn(manrope.variable)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
