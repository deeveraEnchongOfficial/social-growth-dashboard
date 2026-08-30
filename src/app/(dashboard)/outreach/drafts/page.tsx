"use client";

import { useState } from "react";
import { Mail, MessageCircle, ExternalLink, Pencil, RotateCw, X, Calendar, Check, Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { outreachMessages } from "@/lib/mock/data";
import type { OutreachMessage } from "@/lib/types";
import { initials, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function OutreachDraftsPage() {
  const [selectedId, setSelectedId] = useState(outreachMessages[0].id);
  const [channel, setChannel] = useState<"Instagram DM" | "Email">("Instagram DM");

  const selected = outreachMessages.find((m) => m.id === selectedId) ?? outreachMessages[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outreach Drafts & Message Preview"
        description="AI-drafted, human-approved. Nothing sends until you say so."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Prospect list */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Prospect list</CardTitle>
            <p className="text-xs text-muted-foreground">{outreachMessages.length} drafts pending</p>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {outreachMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedId(msg.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors",
                  selectedId === msg.id ? "bg-accent" : "hover:bg-muted/50"
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs">{initials(msg.creatorName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{msg.creatorName}</span>
                    <StatusBadge status={msg.status} className="shrink-0" />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {msg.handle} · {msg.category}
                  </p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Message detail */}
        <div className="lg:col-span-2 space-y-4">
          <MessageDetail message={selected} channel={channel} onChannelChange={setChannel} />
        </div>
      </div>
    </div>
  );
}

function MessageDetail({
  message,
  channel,
  onChannelChange,
}: {
  message: OutreachMessage;
  channel: "Instagram DM" | "Email";
  onChannelChange: (c: "Instagram DM" | "Email") => void;
}) {
  return (
    <>
      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{message.creatorName}</CardTitle>
              <StatusBadge status={message.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              {message.handle} · {message.platform} · {message.category}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => toast.info("Opening profile")}>
            View profile <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={channel} onValueChange={(v) => onChannelChange(v as "Instagram DM" | "Email")}>
            <TabsList>
              <TabsTrigger value="Instagram DM" className="text-xs">
                <MessageCircle className="h-3.5 w-3.5" /> Instagram DM
              </TabsTrigger>
              <TabsTrigger value="Email" className="text-xs">
                <Mail className="h-3.5 w-3.5" /> Email
              </TabsTrigger>
              <TabsTrigger value="followup" className="text-xs">
                Follow Up
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Personalized {channel} · ~120 words
              </p>
              <Badge variant="muted" className="text-xs">
                <Sparkles className="h-3 w-3" /> AI drafted
              </Badge>
            </div>
            <pre className="whitespace-pre-wrap rounded-md border bg-muted/20 p-4 text-sm leading-relaxed font-sans">
              {message.body}
            </pre>
          </div>

          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button variant="outline" size="sm" onClick={() => toast.info("Edit mode")}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("Regenerating…")}>
              <RotateCw className="h-3.5 w-3.5" /> Regenerate
            </Button>
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => toast.success("Rejected")}>
              <X className="h-3.5 w-3.5" /> Reject
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Scheduled")}>
              <Calendar className="h-3.5 w-3.5" /> Schedule
            </Button>
            <Button variant="success" size="sm" onClick={() => toast.success("Approved")}>
              <Check className="h-3.5 w-3.5" /> Approve
            </Button>
            <Button size="sm" onClick={() => toast.success("Sent")}>
              <Send className="h-3.5 w-3.5" /> Send now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personalization details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personalization details</CardTitle>
          <p className="text-xs text-muted-foreground">What the AI used to make this personal.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailRow label="Bio insight" value={message.personalization.bioInsight} />
          <DetailRow
            label="Content topics"
            value={message.personalization.contentTopics.join(", ")}
          />
          <DetailRow label="Location" value={message.personalization.location} />
          <DetailRow label="Category" value={message.personalization.category} />
          <DetailRow label="Brand fit reason" value={message.personalization.brandFitReason} />
          <DetailRow label="Contact source" value={message.personalization.contactSource} />
        </CardContent>
      </Card>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b pb-2 last:border-0 sm:flex-row sm:gap-4">
      <span className="w-32 shrink-0 text-xs font-semibold text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
