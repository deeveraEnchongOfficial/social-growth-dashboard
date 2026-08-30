import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { KpiStat } from "@/lib/types";

export function StatCard({ stat }: { stat: KpiStat }) {
  const Icon = getIcon(stat.icon);
  const deltaTone = stat.deltaTone ?? "neutral";
  const DeltaIcon =
    deltaTone === "positive"
      ? ArrowUpRight
      : deltaTone === "negative"
        ? ArrowDownRight
        : Minus;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4.5 w-4.5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          {stat.delta && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                deltaTone === "positive" && "text-success",
                deltaTone === "negative" && "text-destructive",
                deltaTone === "neutral" && "text-muted-foreground"
              )}
            >
              <DeltaIcon className="h-3 w-3" />
              {stat.delta}
            </span>
          )}
          <span className="text-muted-foreground">{stat.sublabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
