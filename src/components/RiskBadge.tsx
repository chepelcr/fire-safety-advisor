import { Badge } from "@/components/ui/badge";
import type { RiskLevel } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";

const STYLES: Record<RiskLevel, string> = {
  low: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  high: "bg-primary/15 text-primary border-primary/30",
};

const LABELS: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function RiskBadge({ level, className }: { level?: RiskLevel; className?: string }) {
  if (!level) return <Badge variant="outline" className={className}>—</Badge>;
  return (
    <Badge variant="outline" className={cn("border", STYLES[level], className)}>
      {LABELS[level]}
    </Badge>
  );
}
