import type { ReactNode } from "react";
import { cn } from "@/common/lib/cn";
import { Label } from "@/common/components/primitives";

type FormFieldProps = {
  label: string;
  error?: string;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

export function FormField({
  label,
  error,
  className,
  bodyClassName,
  children,
}: FormFieldProps) {
  return (
    <Label className={className}>
      <span>{label}</span>
      <div className={cn("mt-2", bodyClassName)}>{children}</div>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </Label>
  );
}
