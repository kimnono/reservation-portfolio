import type { SelectHTMLAttributes } from "react";
import { cn } from "@/common/lib/cn";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-[20px] border border-border bg-background px-4 text-sm outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
