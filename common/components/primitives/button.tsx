import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/common/lib/cn";

type ButtonVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "secondary"
  | "danger"
  | "tile";
type ButtonSize = "sm" | "md" | "lg" | "icon" | "tile";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground shadow-[0_14px_30px_rgba(13,114,98,0.14)] hover:opacity-92",
  outline:
    "border border-border bg-surface text-foreground hover:bg-surface-muted",
  ghost: "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
  secondary:
    "bg-surface-muted text-foreground hover:border-accent hover:bg-accent/5",
  danger:
    "bg-danger text-white shadow-[0_14px_30px_rgba(191,74,85,0.14)] hover:opacity-92",
  tile:
    "justify-start rounded-[22px] border border-border bg-surface-muted text-left text-foreground hover:border-accent hover:bg-accent/5",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-13 px-6 text-base",
  icon: "h-11 w-11 p-0",
  tile: "px-4 py-4 text-sm",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}
