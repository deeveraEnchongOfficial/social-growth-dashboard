"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { FilterBar, type FilterConfig } from "@/components/shared/filter-bar";
import { DataTable } from "@/components/shared/data-table";
import { EngagementChart, ThemeBars, PlatformShareChart } from "@/components/shared/charts";
import { AiStrategySummaryCard } from "@/components/shared/ai-insight-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  socialPosts,
  engagementSeries,
  themeScores,
  platformShares,
  hookPerformance,
  aiStrategySummary,
} from "@/lib/mock/data";
import { PLATFORMS, CONTENT_THEMES } from "@/lib/constants";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { SocialPost } from "@/lib/types";

const allOption = { label: "All", value: "all" };

export default function PerformancePage() {
  const [platform, setPlatform] = useState("all");
  const [theme, setTheme] = useState("all");
  const [range, setRange] = useState("7");

  const filters: FilterConfig[] = [
    {
      id: "platform",
      label: "Filter",
      value: platform,
      onChange: setPlatform,
      options: [allOption, ...PLATFORMS.map((p) => ({ label: p, value: p }))],
    },
    {
      id: "theme",
      label: "Theme",
      value: theme,
      onChange: setTheme,
      options: [allOption, ...CONTENT_THEMES.map((t) => ({ label: t, value: t }))],
    },
    {
      id: "range",
      label: "Range",
      value: range,
      onChange: setRange,
      options: [
        { label: "Last 7 days", value: "7" },
        { label: "Last 30 days", value: "30" },
        { label: "Quarter", value: "90" },
        { label: "All", value: "all" },
      ],
    },
  ];

  const filteredPosts = useMemo(
    () =>
      socialPosts.filter(
        (p) =>
          (platform === "all" || p.platform === platform) &&
          (theme === "all" || p.topic === theme)
      ),
    [platform, theme]
  );

  const columns: ColumnDef<SocialPost>[] = useMemo(
    () => [
      {
        accessorKey: "caption",
        header: "Post",
        cell: ({ row }) => (
          <span className="line-clamp-1 max-w-xs text-sm font-medium">
            {row.original.caption}
          </span>
        ),
      },
      {
        accessorKey: "platform",
        header: "Platform",
        cell: ({ row }) => <Badge variant="muted">{row.original.platform}</Badge>,
      },
      {
        accessorKey: "topic",
        header: "Topic",
        cell: ({ row }) => <span className="text-sm">{row.original.topic}</span>,
      },
      {
        accessorKey: "views",
        header: "Views",
        cell: ({ row }) => (
          <span className="tabular-nums">{formatNumber(row.original.views)}</span>
        ),
      },
      {
        accessorKey: "likes",
        header: "Likes",
        cell: ({ row }) => (
          <span className="tabular-nums">{formatNumber(row.original.likes)}</span>
        ),
      },
      {
        accessorKey: "comments",
        header: "Comm.",
        cell: ({ row }) => (
          <span className="tabular-nums">{formatNumber(row.original.comments)}</span>
        ),
      },
      {
        accessorKey: "shares",
        header: "Shares",
        cell: ({ row }) => (
          <span className="tabular-nums">{formatNumber(row.original.shares)}</span>
        ),
      },
      {
        accessorKey: "engagementRate",
        header: "ER%",
        cell: ({ row }) => (
          <span className="font-medium tabular-nums text-success">
            {formatPercent(row.original.engagementRate)}
          </span>
        ),
      },
      {
        id: "aiInsight",
        header: "AI insight",
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="line-clamp-1 max-w-[200px]">{row.original.aiInsight}</span>
          </span>
        ),
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            className="whitespace-nowrap text-xs"
            onClick={() => toast.info(`Action: ${row.original.recommendedAction}`)}
          >
            {row.original.recommendedAction}
            <ArrowRight className="h-3 w-3" />
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Social Performance Intelligence"
        description="Connected to Tikhub for content performance signals across TikTok and Instagram."
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.success("Export started")}>
            Export
          </Button>
        }
      />

      <FilterBar
        filters={filters}
        onExport={() => toast.success("Export started")}
        onAiSummary={() => toast.success("AI summary generated")}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EngagementChart data={engagementSeries} />
        </div>
        <ThemeBars data={themeScores} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PlatformShareChart data={platformShares} />
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Hook performance
            </CardTitle>
            <p className="text-xs text-muted-foreground">Top-performing first 3 seconds</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {hookPerformance.map((hook) => (
              <div key={hook.hook} className="flex items-center gap-3">
                <span className="flex-1 text-sm">{hook.hook}</span>
                <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(hook.score / 10) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-semibold tabular-nums">
                  {hook.score}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Posts</CardTitle>
          <p className="text-xs text-muted-foreground">Per-post AI insight and recommended action</p>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredPosts} pageSize={10} />
        </CardContent>
      </Card>

      <AiStrategySummaryCard
        summary={aiStrategySummary}
        onSendToContent={() => toast.success("Sent to Content Generator")}
      />
    </div>
  );
}
