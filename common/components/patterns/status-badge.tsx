import type { ReactNode } from "react";
import { Badge } from "@/common/components/primitives";

type StatusBadgeProps = {
  tone: "neutral" | "success" | "warning" | "danger" | "accent";
  children: ReactNode;
};

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return <Badge variant={tone}>{children}</Badge>;
}
