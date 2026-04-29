import Link from "next/link";
import { publicNavigation } from "@/common/config/navigation";
import { getSession } from "@/features/auth/session";
import { getRoleLabel } from "@/features/auth/roles";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { cn } from "@/common/lib/cn";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const navigationItems = session.user
    ? publicNavigation.filter((item) => item.href !== "/auth/sign-in")
    : publicNavigation.filter(
        (item) =>
          item.href === "/" || item.href === "/reservations" || item.href === "/auth/sign-in",
      );

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

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <nav className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 transition-colors hover:bg-surface hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-full border border-border bg-surface px-4 py-2 text-sm",
                  !session.user && "text-muted-foreground",
                )}
              >
                {session.user
                  ? `${session.user.name} / ${getRoleLabel(session.user.role)}`
                  : "게스트 모드"}
              </div>
              {session.user ? <SignOutButton /> : null}
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
