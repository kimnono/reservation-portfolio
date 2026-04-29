"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/common/lib/cn";

type SignOutButtonProps = {
  compact?: boolean;
};

export function SignOutButton({ compact = false }: SignOutButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSignOut() {
    setIsPending(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      startTransition(() => {
        router.replace("/auth/sign-in");
        router.refresh();
      });
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      aria-label="로그아웃"
      title={compact ? "로그아웃" : undefined}
      className={cn(
        "border border-border text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground disabled:opacity-60",
        compact
          ? "flex h-12 w-12 items-center justify-center rounded-2xl"
          : "rounded-full px-3 py-2 text-sm",
      )}
    >
      {compact ? (
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
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      ) : isPending ? (
        "로그아웃 중..."
      ) : (
        "로그아웃"
      )}
    </button>
  );
}
