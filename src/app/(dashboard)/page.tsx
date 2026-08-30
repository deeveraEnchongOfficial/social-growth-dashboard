import Link from "next/link";
import {
  BarChart3,
  PenLine,
  Repeat2,
  UserSearch,
  Mail,
  Library,
  BrainCircuit,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Pipeline } from "@/components/shared/pipeline";
import { AiInsightCard } from "@/components/shared/ai-insight-card";
import { EngagementChart } from "@/components/shared/charts";
import {
  dashboardKpis,
  weeklyRecommendations,
  contentPipeline,
  outreachPipeline,
  engagementSeries,
} from "@/lib/mock/data";
import { CURRENT_USER, BRAND_NAME } from "@/lib/constants";

const quickActions = [
  { label: "Analyze Social Posts", href: "/performance", icon: BarChart3 },
  { label: "Generate New Content", href: "/content", icon: PenLine },
  { label: "Repurpose Existing Post", href: "/repurpose", icon: Repeat2 },
  { label: "Find Creators", href: "/outreach/search", icon: UserSearch },
  { label: "Draft Outreach", href: "/outreach/drafts", icon: Mail },
  { label: "Upload Brand Reference", href: "/library", icon: Library },
  { label: "Add Business Knowledge", href: "/knowledge", icon: BrainCircuit },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${CURRENT_USER.name.split(" ")[0]}`}
        description={`Here's what's moving the needle for ${BRAND_NAME} Brand this week.`}
        actions={
          <>
            <Button variant="outline" size="sm">
              Weekly report
            </Button>
            <Button size="sm" asChild>
              <Link href="/content">
                <Sparkles className="h-4 w-4" />
                Generate content
              </Link>
            </Button>
          </>
        }
      />

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {dashboardKpis.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* AI recommendations — spans 2 */}
        <div className="lg:col-span-2">
          <AiInsightCard
            subtitle="Generated from this week's performance, audience signals, and brand memory."
            recommendations={weeklyRecommendations}
          />
        </div>

        {/* Engagement chart */}
        <EngagementChart data={engagementSeries} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Pipeline
          title="Content Pipeline"
          subtitle="From idea to posted."
          stages={contentPipeline}
          href="/approvals"
          ctaLabel="Open queue"
        />
        <Pipeline
          title="Outreach Pipeline"
          stages={outreachPipeline}
          href="/outreach/status"
          ctaLabel="View status"
        />
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
          <p className="text-xs text-muted-foreground">Jump straight into a workflow.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <action.icon className="h-4.5 w-4.5" />
                </div>
                <span className="flex-1 text-sm font-medium">{action.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top theme insight */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Top content theme this week
            </p>
            <p className="text-sm">
              <span className="font-semibold">Pro Technique Education</span> drove 2.4× the saves
              and 38% more comments than product spotlights. Recommended next move: build a 4-part
              series.
            </p>
            <p className="text-xs text-muted-foreground">AI suggested</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/content">
              Build the series
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
