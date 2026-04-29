import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/common/lib/cn";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-[20px] border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-accent disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
