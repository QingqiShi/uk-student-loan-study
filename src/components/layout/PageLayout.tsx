import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  repaymentYear?: number;
  mainClassName?: string;
}

export function PageLayout({
  children,
  repaymentYear,
  mainClassName,
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header repaymentYear={repaymentYear} />
      <main
        id="main-content"
        className={cn(
          "mx-auto w-full max-w-4xl flex-1 space-y-6 px-3 pt-8 pb-6 sm:pt-18 md:pb-8",
          mainClassName,
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
