import type { HTMLAttributes } from "react";
import { cn } from "@/common/lib/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[28px] bg-surface-muted", className)}
      {...props}
    />
  );
}
