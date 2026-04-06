import { cn } from "@/common/utils/cn";
import { field } from "@/styles/field";

type FormFieldProps = {
  label: string;
  error?: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
};

export function FormField({
  label,
  error,
  className,
  bodyClassName,
  children,
}: FormFieldProps) {
  return (
    <label className={cn(field.wrapper, className)}>
      <span className={field.label}>{label}</span>
      <div className={cn(field.body, bodyClassName)}>{children}</div>
      {error ? <p className={field.error}>{error}</p> : null}
    </label>
  );
}
