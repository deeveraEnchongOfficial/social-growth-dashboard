"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pause, Play, RotateCw, Send, Download, Activity } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { outreachMessages, outreachStatusCounts, liveActivity } from "@/lib/mock/data";
import type { OutreachMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusCardTone: Record<string, string> = {
  Approved: "border-primary/30 bg-primary/5 text-primary",
  Queued: "border-secondary bg-secondary/30",
  Sending: "border-warning/30 bg-warning/5 text-warning",
  Sent: "border-success/30 bg-success/5 text-success",
  Failed: "border-destructive/30 bg-destructive/5 text-destructive",
  Replied: "border-success/30 bg-success/5 text-success",
  "Follow Up Needed": "border-warning/30 bg-warning/5 text-warning",
  "Do Not Contact": "border-muted bg-muted/30 text-muted-foreground",
};

const activityTone: Record<string, string> = {
  neutral: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

export default function SendingStatusPage() {
  const [paused, setPaused] = useState(false);

  const columns: ColumnDef<OutreachMessage>[] = useMemo(
    () => [
      {
        accessorKey: "creatorName",
        header: "Recipient",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.handle}</span>
        ),
      },
      { accessorKey: "channel", header: "Channel" },
      { accessorKey: "type", header: "Type" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      { accessorKey: "lastAction", header: "Last action" },
      { accessorKey: "time", header: "Time" },
      {
        id: "reply",
        header: "Reply",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.replyStatus ?? "—"}</span>
        ),
      },
      {
        id: "nextAction",
        header: "Next action",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.nextAction ?? "—"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outreach Sending Status"
        description="Live status across Instagram DMs (Apify) and Gmail. Only approved messages send."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPaused((p) => !p);
                toast.info(paused ? "Sending resumed" : "Sending paused");
              }}
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {paused ? "Resume" : "Pause sending"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Retrying failed")}>
              <RotateCw className="h-4 w-4" /> Retry failed
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Follow-ups queued")}>
              <Send className="h-4 w-4" /> Send follow-ups
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Export started")}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        }
      />

      <p className="text-xs text-muted-foreground">
        The system only sends approved messages. Auto-send is disabled by brand guardrail.
      </p>

      {/* Status summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {outreachStatusCounts.map((item) => (
          <div
            key={item.status}
            className={cn("rounded-lg border p-3", statusCardTone[item.status])}
          >
            <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
            <p className="text-xs">{item.status}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* All sends table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">All sends</CardTitle>
            <p className="text-xs text-muted-foreground">Latest activity across all channels</p>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={outreachMessages} pageSize={10} />
          </CardContent>
        </Card>

        {/* Live activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Live activity
            </CardTitle>
            <p className="text-xs text-muted-foreground">Recent sends, replies, and failures</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {liveActivity.map((event) => (
                <li key={event.id} className="flex items-start gap-2.5 text-sm">
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      activityTone[event.tone]
                    )}
                  />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-foreground/90">{event.text}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
