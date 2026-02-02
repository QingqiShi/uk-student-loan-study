import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-4xl px-3 py-6">
        <p className="text-center text-xs text-muted-foreground sm:text-sm">
          This calculator is for illustrative purposes only and does not
          constitute financial advice. Calculations are based on current UK
          student loan rules and may change. For personalised guidance, consult
          a qualified financial adviser.
        </p>
        <p className="mt-4 text-center text-xs text-muted-foreground/60">
          <Link
            href="/brand"
            className="hover:text-muted-foreground hover:underline"
          >
            Brand Guidelines
          </Link>
        </p>
      </div>
    </footer>
  );
}
