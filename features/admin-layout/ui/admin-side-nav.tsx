"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/common/config/navigation";
import { cn } from "@/common/utils/cn";

type AdminSideNavProps = {
  isCompact?: boolean;
  onNavigate?: () => void;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({ href }: { href: string }) {
  const commonProps = {
    className: "h-4 w-4",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (href) {
    case "/admin":
      return (
        <svg {...commonProps}>
          <path d="M4 5h7v6H4z" />
          <path d="M13 5h7v10h-7z" />
          <path d="M4 13h7v6H4z" />
          <path d="M13 17h7v2h-7z" />
        </svg>
      );
    case "/admin/reservations":
      return (
        <svg {...commonProps}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M4 10h16" />
        </svg>
      );
    case "/admin/resources":
      return (
        <svg {...commonProps}>
          <path d="M6 20h12" />
          <path d="M12 4v12" />
          <path d="m7 9 5-5 5 5" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export function AdminSideNav({
  isCompact = false,
  onNavigate,
}: AdminSideNavProps) {
  const pathname = usePathname();

  return (
    <nav className="mt-8 grid gap-2 text-sm">
      {adminNavigation.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            title={isCompact ? item.label : undefined}
            className={cn(
              "rounded-[20px] transition-colors",
              isCompact
                ? "flex h-12 items-center justify-center px-3 py-3"
                : "flex items-center gap-3 px-4 py-3",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
            )}
          >
            {isCompact ? (
              <NavIcon href={item.href} />
            ) : (
              <>
                <NavIcon href={item.href} />
                <span>{item.label}</span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
