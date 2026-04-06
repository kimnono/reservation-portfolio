"use client";

import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/common/config/navigation";
import { SignOutButton } from "@/features/auth/ui/sign-out-button";
import { cn } from "@/common/utils/cn";
import { AdminSideNav } from "@/features/admin-layout/ui/admin-side-nav";

type AdminShellProps = {
  children: React.ReactNode;
  userName?: string;
};

const STORAGE_KEY = "tk-admin-nav-compact";
const STORAGE_EVENT_NAME = "tk-admin-nav-compact-change";

function subscribeToAdminShellPreference(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === STORAGE_KEY) {
      onStoreChange();
    }
  };
  const handleLocalPreferenceChange = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_EVENT_NAME, handleLocalPreferenceChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_EVENT_NAME, handleLocalPreferenceChange);
  };
}

function getAdminShellPreferenceSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function getAdminShellPreferenceServerSnapshot() {
  return false;
}

export function AdminShell({ children, userName }: AdminShellProps) {
  const pathname = usePathname();
  const isCompact = useSyncExternalStore(
    subscribeToAdminShellPreference,
    getAdminShellPreferenceSnapshot,
    getAdminShellPreferenceServerSnapshot,
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentItem =
    adminNavigation.find((item) =>
      item.href === "/admin"
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? adminNavigation[0];

  function handleCompactToggle() {
    const nextValue = !isCompact;
    window.localStorage.setItem(STORAGE_KEY, String(nextValue));
    window.dispatchEvent(new Event(STORAGE_EVENT_NAME));
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="px-3 pt-3 sm:px-4 lg:hidden">
        <div className="flex items-center justify-between rounded-[28px] border border-border bg-surface px-4 py-3 shadow-[0_18px_40px_rgba(8,19,24,0.08)]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-accent">관리자</p>
            <p className="text-base font-semibold">{currentItem.label}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-border bg-background text-muted-foreground"
            aria-label="관리자 메뉴 열기"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {isMobileOpen ? (
        <button
          type="button"
          aria-label="관리자 메뉴 닫기"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-30 bg-[#11222a]/24 lg:hidden"
        />
      ) : null}

      <div
        className={cn(
          "grid min-h-screen w-full gap-6 px-3 py-3 transition-[grid-template-columns] duration-200 sm:px-4 sm:py-4 lg:px-6 lg:py-6",
          isCompact
            ? "lg:grid-cols-[110px_minmax(0,1fr)]"
            : "lg:grid-cols-[296px_minmax(0,1fr)]",
        )}
      >
        <aside
          className={cn(
            "fixed inset-y-3 left-3 z-40 w-[min(340px,calc(100vw-1.5rem))] rounded-[30px] border border-border bg-[linear-gradient(180deg,#11222a_0%,#17313a_100%)] p-4 text-white shadow-[0_24px_60px_rgba(8,19,24,0.22)] transition-transform duration-200 sm:left-4 sm:inset-y-4 lg:static lg:z-auto lg:w-auto lg:translate-x-0 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:shadow-none",
            isMobileOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0",
            isCompact ? "lg:px-3" : "lg:px-5",
          )}
        >
          <div
            className={cn(
              "flex items-start justify-between gap-3",
              isCompact && "lg:flex-col lg:items-center",
            )}
          >
            <div className={cn(isCompact && "lg:text-center")}>
              <p className="text-xs uppercase tracking-[0.26em] text-white/50">
                관리자 패널
              </p>
              <h1
                className={cn("mt-2 text-2xl font-semibold", isCompact && "lg:text-lg")}
              >
                {isCompact ? "TK" : "Timekeeper"}
              </h1>
              <p className={cn("mt-2 text-sm text-white/62", isCompact && "lg:hidden")}>
                {userName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCompactToggle}
                className="hidden h-11 w-11 items-center justify-center rounded-[18px] border border-white/10 bg-white/8 text-white/74 transition hover:bg-white/14 lg:flex"
                aria-label={isCompact ? "메뉴 펼치기" : "메뉴 접기"}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={cn("h-4 w-4 transition-transform", isCompact && "rotate-180")}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/10 bg-white/8 text-white/74 lg:hidden"
                aria-label="관리자 메뉴 닫기"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>

          <AdminSideNav isCompact={isCompact} onNavigate={() => setIsMobileOpen(false)} />

          <div className={cn("mt-8", isCompact && "lg:flex lg:justify-center")}>
            <SignOutButton compact={isCompact} />
          </div>
        </aside>

        <main className="min-w-0 overflow-hidden rounded-[32px] border border-border bg-surface shadow-[0_20px_60px_rgba(8,19,24,0.08)]">
          {children}
        </main>
      </div>
    </div>
  );
}
