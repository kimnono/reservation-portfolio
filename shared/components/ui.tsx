import type { ReactNode } from "react";
import { cn } from "@/common/utils/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
};

type StatusBadgeProps = {
  tone: "neutral" | "success" | "warning" | "danger" | "accent";
  children: ReactNode;
};

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

type EmptyStateProps = {
  title: string;
  description: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-border/70 bg-surface/95 p-6 shadow-[0_20px_60px_rgba(8,19,24,0.08)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  const toneClassName = {
    neutral: "bg-surface-muted text-muted-foreground",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-rose-100 text-rose-700",
    accent: "bg-accent/12 text-accent",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.08em]",
        toneClassName,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground md:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed bg-surface-muted/60 text-center">
      <p className="text-lg font-semibold tracking-[-0.03em]">{title}</p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </Card>
  );
}

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="space-y-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-semibold tracking-[-0.05em] text-foreground">
        {value}
      </p>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </Card>
  );
}
