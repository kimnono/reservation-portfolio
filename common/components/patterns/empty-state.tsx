import { Card } from "@/common/components/primitives";

type EmptyStateProps = {
  title: string;
  description: string;
};

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
