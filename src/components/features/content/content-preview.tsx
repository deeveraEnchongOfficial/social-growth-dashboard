"use client";

import { Sparkles, RotateCw, Pencil, Save, Repeat2, ImagePlus, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/states";
import type { ContentDraft } from "@/lib/types";
import { toast } from "sonner";

export function ContentPreview({
  draft,
  loading,
  onRegenerate,
}: {
  draft: ContentDraft | null;
  loading: boolean;
  onRegenerate: () => void;
}) {
  if (loading) {
    return (
      <Card className="flex h-full items-center justify-center">
        <CardContent className="flex flex-col items-center gap-3 py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Generating on-brand content…</p>
        </CardContent>
      </Card>
    );
  }

  if (!draft) {
    return (
      <Card className="h-full">
        <CardContent className="py-20">
          <EmptyState
            title="Your generated preview will appear here"
            description="Fill in the brief and click Generate to create on-brand content."
            icon={Sparkles}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">Generated preview</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{draft.type}</span>
            <span>·</span>
            <span>{draft.platform}</span>
            <span>·</span>
            <span>{draft.tone}</span>
          </div>
        </div>
        <Badge variant="secondary">Draft v2</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</label>
          <p className="text-sm font-medium">{draft.title}</p>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hook</label>
          <p className="text-sm italic text-foreground/90">{draft.hook}</p>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Caption</label>
          <p className="text-sm leading-relaxed text-foreground/90">{draft.caption}</p>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">CTA</label>
          <p className="text-sm">{draft.cta}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {draft.hashtags.map((tag) => (
            <Badge key={tag} variant="muted" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="space-y-1 rounded-md bg-muted/40 p-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggested visual</label>
          <p className="text-sm text-foreground/80">{draft.visualSuggestion}</p>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-success/10 p-3 text-sm text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Brand-safety check: {draft.brandSafety}</span>
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button variant="outline" size="sm" onClick={onRegenerate}>
            <RotateCw className="h-4 w-4" /> Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Edit mode")}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Draft saved")}>
            <Save className="h-4 w-4" /> Save draft
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Sent to Repurposing")}>
            <Repeat2 className="h-4 w-4" /> Repurpose
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Sent to Image Studio")}>
            <ImagePlus className="h-4 w-4" /> Generate image
          </Button>
          <Button size="sm" onClick={() => toast.success("Sent to Approval Queue")}>
            <Send className="h-4 w-4" /> Send to approval
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
