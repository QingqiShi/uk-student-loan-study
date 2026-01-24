import type { Metadata } from 'next';
import { initFirebase } from '@/lib/firebase';
import './globals.css';

export const metadata: Metadata = {
  title: 'UK Student Loan Study',
  description: 'Interactive tool to understand UK student loan repayment',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined') {
    initFirebase();
  }

  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
