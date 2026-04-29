import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/common/lib/cn";
import { Button } from "@/common/components/primitives/button";

export function Tabs({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-4", className)} {...props} />;
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-wrap gap-2", className)} {...props} />;
}

export function TabsTrigger({
  className,
  active = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <Button
      variant={active ? "primary" : "secondary"}
      size="sm"
      className={className}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-w-0", className)} {...props} />;
}
