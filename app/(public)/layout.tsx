import Link from "next/link";
import { PublicSessionNav } from "@/features/auth/public-session-nav";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-semibold tracking-[-0.06em]">
              Timekeeper
            </Link>
            <span className="hidden rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-accent md:inline-flex">
              예약 포트폴리오
            </span>
          </div>

          <PublicSessionNav />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
