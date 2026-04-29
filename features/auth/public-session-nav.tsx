"use client";

import Link from "next/link";
import { publicNavigation } from "@/common/config/navigation";
import { cn } from "@/common/lib/cn";
import { getRoleLabel } from "@/features/auth/roles";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { useSessionQuery } from "@/features/auth/use-session-query";

export function PublicSessionNav() {
  const { data: session } = useSessionQuery();
  const user = session?.user ?? null;

  const navigationItems = user
    ? publicNavigation.filter((item) => item.href !== "/auth/sign-in")
    : publicNavigation.filter(
        (item) =>
          item.href === "/" ||
          item.href === "/reservations" ||
          item.href === "/auth/sign-in",
      );

  return (
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
            !user && "text-muted-foreground",
          )}
        >
          {user ? `${user.name} / ${getRoleLabel(user.role)}` : "게스트 모드"}
        </div>
        {user ? <SignOutButton /> : null}
      </div>
    </div>
  );
}
