import { Analytics } from "@vercel/analytics/react";
import { Manrope, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
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
    default: "UK Student Loan Study - Student Loan Repayment Calculator",
    template: "%s | UK Student Loan Study",
  },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <LoanProvider>{children}</LoanProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
