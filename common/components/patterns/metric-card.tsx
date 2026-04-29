import { Card } from "@/common/components/primitives";

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
