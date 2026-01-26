interface LayoutProps {
  stickyPanel?: React.ReactNode;
  content?: React.ReactNode;
}

export function Layout({ stickyPanel, content }: LayoutProps) {
  return (
    <div className="grid gap-4 px-4 pb-4 md:grid-cols-[400px_1fr] md:px-6 md:pb-6">
      <aside className="relative h-full" aria-label="Loan configuration panel">
        <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-auto pt-4">
          {stickyPanel}
        </div>
      </aside>
      <main id="main-content" className="pt-4">
        <div className="rounded-lg border bg-card p-4">{content}</div>
      </main>
    </div>
  );
}
