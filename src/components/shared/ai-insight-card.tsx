import { Sparkles, Lightbulb, TrendingUp, TrendingDown, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AiStrategySummary, WeeklyRecommendation } from "@/lib/types";

export function AiInsightCard({
  title = "Weekly AI Recommendations",
  subtitle,
  recommendations,
  updatedLabel = "Updated 2h ago",
}: {
  title?: string;
  subtitle?: string;
  recommendations: WeeklyRecommendation[];
  updatedLabel?: string;
}) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{updatedLabel}</span>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {recommendations.map((rec) => (
            <li key={rec.id} className="flex gap-2.5 text-sm">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
              <span className="text-foreground/90">{rec.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function AiStrategySummaryCard({
  summary,
  onSendToContent,
}: {
  summary: AiStrategySummary;
  onSendToContent?: () => void;
}) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Strategy Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SummaryRow icon={TrendingUp} label="What worked" text={summary.whatWorked} tone="success" />
        <SummaryRow icon={TrendingDown} label="What underperformed" text={summary.whatUnderperformed} tone="warning" />
        <SummaryRow icon={Lightbulb} label="What to create next" text={summary.whatToCreateNext} tone="primary" />
        <SummaryRow icon={XCircle} label="What to avoid" text={summary.whatToAvoid} tone="destructive" />

        <div className="space-y-2 rounded-md bg-muted/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Suggested hooks
          </p>
          <ul className="space-y-1 text-sm">
            {summary.suggestedHooks.map((hook) => (
              <li key={hook} className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                {hook}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 rounded-md bg-muted/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Suggested carousel topics
          </p>
          <ul className="space-y-1 text-sm">
            {summary.suggestedCarouselTopics.map((topic) => (
              <li key={topic} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                {topic}
              </li>
            ))}
          </ul>
        </div>

        {onSendToContent && (
          <Button onClick={onSendToContent} className="w-full">
            <Sparkles className="h-4 w-4" />
            Send to Content Generator
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  text,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  text: string;
  tone: "success" | "warning" | "primary" | "destructive";
}) {
  const toneClass = {
    success: "text-success",
    warning: "text-warning",
    primary: "text-primary",
    destructive: "text-destructive",
  }[tone];

  return (
    <div className="flex gap-3">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${toneClass}`} />
      <div className="space-y-0.5">
        <p className={`text-xs font-semibold ${toneClass}`}>{label}</p>
        <p className="text-sm text-foreground/90">{text}</p>
      </div>
    </div>
  );
}
