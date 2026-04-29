import type { HTMLAttributes } from "react";
import { cn } from "@/common/lib/cn";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "accent";

const badgeVariants: Record<BadgeVariant, string> = {
  neutral: "bg-surface-muted text-muted-foreground",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-rose-100 text-rose-700",
  accent: "bg-accent/12 text-accent",
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.08em]",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
