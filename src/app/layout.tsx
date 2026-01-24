import type { Metadata } from 'next';
import { initFirebase } from '@/lib/firebase';
import './globals.css';

export const metadata: Metadata = {
  title: 'UK Student Loan Study - Student Loan Repayment Calculator',
  description:
    'Interactive calculator to understand UK student loan repayment. Compare Plan 2 and Plan 5, visualize total repayments, and see effective interest rates based on your salary.',
  keywords: [
    'UK student loan',
    'student loan calculator',
    'Plan 2',
    'Plan 5',
    'student loan repayment',
    'student finance',
    'loan write-off',
  ],
  authors: [{ name: 'UK Student Loan Study' }],
  openGraph: {
    title: 'UK Student Loan Study',
    description:
      'Interactive calculator to understand UK student loan repayment under Plan 2, Plan 5, and Postgraduate schemes.',
    url: 'https://studentloanstudy.uk',
    siteName: 'UK Student Loan Study',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Student Loan Study',
    description:
      'Interactive calculator to understand UK student loan repayment under Plan 2, Plan 5, and Postgraduate schemes.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UK Student Loan Study',
  description:
    'Interactive calculator to understand UK student loan repayment under Plan 2, Plan 5, and Postgraduate schemes.',
  url: 'https://studentloanstudy.uk',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined') {
    initFirebase();
  }

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
