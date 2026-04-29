import type { InputHTMLAttributes } from "react";
import { cn } from "@/common/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-[20px] border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-accent disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
