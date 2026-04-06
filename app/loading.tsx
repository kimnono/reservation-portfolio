import { ui } from "@/styles/ui";

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-16">
      <div className="w-full rounded-[32px] border border-border bg-surface p-8 shadow-[0_18px_60px_rgba(8,19,24,0.08)]">
        <div className="h-4 w-32 animate-pulse rounded-full bg-surface-muted" />
        <div className="mt-4 h-12 w-72 animate-pulse rounded-full bg-surface-muted" />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className={`h-40 ${ui.skeletonBlock}`} />
          <div className={`h-40 ${ui.skeletonBlock}`} />
          <div className={`h-40 ${ui.skeletonBlock}`} />
        </div>
      </div>
    </main>
  );
}
