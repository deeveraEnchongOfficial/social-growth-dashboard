"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clapperboard, Loader2, Sparkles, RotateCw, Pencil, Save, Repeat2, Send, Copy, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AiFillButton } from "@/components/shared/ai-fill-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/states";
import { scriptBriefSchema, type ScriptBriefValues } from "@/lib/schemas";
import { VIDEO_CATEGORIES, VIDEO_LENGTHS, SPEAKERS, TONES } from "@/lib/constants";
import { useDropdownValues } from "@/lib/hooks/use-dropdown-values";
import { sendToApproval } from "@/lib/approval-helpers";
import type { VideoScript } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ScriptsPage() {
  const [script, setScript] = useState<VideoScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { values: dv } = useDropdownValues();

  const categories = dv?.scripts.categories ?? VIDEO_CATEGORIES;
  const lengths = dv?.scripts.lengths ?? VIDEO_LENGTHS;
  const speakers = dv?.scripts.speakers ?? SPEAKERS;
  const tones = dv?.scripts.tones ?? TONES;

  const [activeCategory, setActiveCategory] = useState<string>(VIDEO_CATEGORIES[1]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ScriptBriefValues>({
    resolver: zodResolver(scriptBriefSchema),
    defaultValues: {
      category: VIDEO_CATEGORIES[1],
      length: VIDEO_LENGTHS[1],
      speaker: SPEAKERS[1],
      tone: TONES[0],
    },
  });

  const values = watch();

  function scriptToMarkdown(s: VideoScript): string {
    const beats = s.beats
      .map((b) => `### ${b.beat}\n\n${b.detail}\n\n**B-roll:** ${b.bRoll}`)
      .join("\n\n");
    return `# ${s.topic}

**Category:** ${s.category}  
**Length:** ${s.length}  
**Speaker:** ${s.speaker}  
**Tone:** ${s.tone}

---

## Hook (0–3s)

> ${s.hook}

## Main Script (3–22s)

${beats}

## On-screen Text

${s.onScreenText}

## CTA (22–30s)

${s.cta}

## Suggested Visuals

${s.visuals}

## Suggested Caption

${s.caption}

## Platform Recommendations

${s.platformRecs}
`;
  }

  async function copyScript() {
    if (!script) return;
    try {
      await navigator.clipboard.writeText(scriptToMarkdown(script));
      setCopied(true);
      toast.success("Script copied as Markdown");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }

  async function onSubmit(data: ScriptBriefValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Generation failed");
      const json = await res.json();
      setScript(json.script);
      toast.success("Script generated");
    } catch {
      toast.error("Generation failed — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Video Script Generator"
        description="Generate short-form scripts your team can shoot in under an hour."
        actions={
          <Button onClick={handleSubmit(onSubmit)} disabled={loading} size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate
          </Button>
        }
      />

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setValue("category", cat);
            }}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              activeCategory === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-accent"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Brief */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Script brief</CardTitle>
              <AiFillButton
                formType="scripts"
                onFill={(fields) => {
                  (Object.keys(fields) as (keyof ScriptBriefValues)[]).forEach((key) => {
                    setValue(key, fields[key as string] as never, { shouldValidate: true });
                  });
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Video topic" error={errors.topic?.message}>
                <Input placeholder="e.g. 3 onboarding mistakes founders make" {...register("topic")} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Audience" error={errors.audience?.message}>
                  <Input placeholder="e.g. SaaS founders" {...register("audience")} />
                </Field>
                <Field label="Length" error={errors.length?.message}>
                  <Select value={values.length} onValueChange={(v) => setValue("length", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {lengths.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Speaker" error={errors.speaker?.message}>
                  <Select value={values.speaker} onValueChange={(v) => setValue("speaker", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {speakers.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Tone" error={errors.tone?.message}>
                  <Select value={values.tone} onValueChange={(v) => setValue("tone", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="CTA" error={errors.cta?.message}>
                <Input placeholder="e.g. Tag a founder who needs this" {...register("cta")} />
              </Field>
              <Field label="Product / service" error={errors.product?.message}>
                <Input placeholder="e.g. GrowthCo Pro subscription" {...register("product")} />
              </Field>
              <Field label="Key points" error={errors.keyPoints?.message}>
                <Textarea placeholder="Planning, posting cadence, review and iterate" {...register("keyPoints")} />
              </Field>
              <Field label="Claims to avoid">
                <Textarea placeholder="No medical-grade language. No permanent results promises." {...register("claimsToAvoid")} />
              </Field>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate script
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <ScriptPreview script={script} loading={loading} onRegenerate={handleSubmit(onSubmit)} onCopy={copyScript} copied={copied} />
      </div>
    </div>
  );
}

function ScriptPreview({
  script,
  loading,
  onRegenerate,
  onCopy,
  copied,
}: {
  script: VideoScript | null;
  loading: boolean;
  onRegenerate: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  if (loading) {
    return (
      <Card className="flex h-full items-center justify-center">
        <CardContent className="flex flex-col items-center gap-3 py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Generating script…</p>
        </CardContent>
      </Card>
    );
  }
  if (!script) {
    return (
      <Card className="h-full">
        <CardContent className="py-20">
          <EmptyState
            title="Your script preview will appear here"
            description="Fill in the brief and click Generate."
            icon={Clapperboard}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Script preview</CardTitle>
          <span className="text-xs text-muted-foreground">
            {script.length} · {script.speaker} · {script.category}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Hook (0–3s)</Label>
          <p className="text-sm font-medium italic">{script.hook}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Main script (3–22s)</Label>
          {script.beats.map((beat) => (
            <div key={beat.beat} className="rounded-md bg-muted/40 p-3 text-sm">
              <p className="font-medium">{beat.beat}: {beat.detail}</p>
              <p className="mt-1 text-xs text-muted-foreground">{beat.bRoll}</p>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">On-screen text</Label>
          <p className="text-sm font-semibold">{script.onScreenText}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">CTA (22–30s)</Label>
          <p className="text-sm">{script.cta}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Suggested visuals</Label>
          <p className="text-sm text-muted-foreground">{script.visuals}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Suggested caption</Label>
          <p className="text-sm">{script.caption}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Platform recommendations</Label>
          <p className="text-sm text-muted-foreground">{script.platformRecs}</p>
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button variant="outline" size="sm" onClick={onCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy MD"}
          </Button>
          <Button variant="outline" size="sm" onClick={onRegenerate}><RotateCw className="h-4 w-4" /> Regenerate</Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Edit mode")}><Pencil className="h-4 w-4" /> Edit</Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Draft saved")}><Save className="h-4 w-4" /> Save draft</Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Sent to Repurposing")}><Repeat2 className="h-4 w-4" /> Repurpose</Button>
          <Button size="sm" onClick={async () => {
            if (!script) return;
            const result = await sendToApproval({
              type: "Scripts",
              title: `${script.length} ${script.category}`,
              preview: script.hook,
              aiSource: "AI · script-gen",
              brandSafety: "Pending review.",
            });
            if (result.success) toast.success("Sent to Approval Queue");
            else toast.error(result.error || "Failed to send to approval");
          }}><Send className="h-4 w-4" /> Send to approval</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
