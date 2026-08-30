import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PipelineStage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Pipeline({
  title,
  subtitle,
  stages,
  href,
  ctaLabel,
}: {
  title: string;
  subtitle?: string;
  stages: PipelineStage[];
  href?: string;
  ctaLabel?: string;
}) {
  const max = Math.max(...stages.map((s) => s.value), 1);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="space-y-0.5">
          <CardTitle className="text-base">{title}</CardTitle>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
          >
            {ctaLabel ?? "Open"} <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.map((stage) => (
          <div key={stage.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{stage.label}</span>
              <span className="font-medium tabular-nums">{stage.value}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full bg-primary")}
                style={{ width: `${(stage.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
