import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

interface PageLayoutProps {
  children: React.ReactNode;
  repaymentYear?: number;
}

export function PageLayout({ children, repaymentYear }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header repaymentYear={repaymentYear} />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-3 py-6 sm:pt-10 md:pb-8"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
