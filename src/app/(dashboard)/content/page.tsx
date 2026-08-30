"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AiFillButton } from "@/components/shared/ai-fill-button";
import { ContentPreview } from "@/components/features/content/content-preview";
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
import { contentBriefSchema, type ContentBriefValues } from "@/lib/schemas";
import {
  CONTENT_GOALS,
  PLATFORMS,
  TONES,
  CONTENT_TYPES,
} from "@/lib/constants";
import type { ContentDraft } from "@/lib/types";
import { toast } from "sonner";

export default function ContentGeneratorPage() {
  const [draft, setDraft] = useState<ContentDraft | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContentBriefValues>({
    resolver: zodResolver(contentBriefSchema),
    defaultValues: {
      goal: "",
      platform: "",
      tone: "",
      contentType: "",
      notes: "",
    },
  });

  const values = watch();

  async function onSubmit(data: ContentBriefValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Generation failed");
      const json = await res.json();
      setDraft(json.draft);
      toast.success("Content generated");
    } catch {
      toast.error("Generation failed — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Generator"
        description="Brand-trained AI writes on-brand content, every time. Powered by OpenRouter."
        actions={
          <Button onClick={handleSubmit(onSubmit)} disabled={loading} size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Brief form */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Brief</CardTitle>
              <AiFillButton
                formType="content"
                onFill={(fields) => {
                  (Object.keys(fields) as (keyof ContentBriefValues)[]).forEach((key) => {
                    setValue(key, fields[key as string] as never, { shouldValidate: true });
                  });
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">The clearer your brief, the better the output.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Content goal" error={errors.goal?.message}>
                <Select value={values.goal} onValueChange={(v) => setValue("goal", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Select a goal" /></SelectTrigger>
                  <SelectContent>
                    {CONTENT_GOALS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Platform" error={errors.platform?.message}>
                  <Select value={values.platform} onValueChange={(v) => setValue("platform", v, { shouldValidate: true })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Tone" error={errors.tone?.message}>
                  <Select value={values.tone} onValueChange={(v) => setValue("tone", v, { shouldValidate: true })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field label="Target audience" error={errors.audience?.message}>
                <Input placeholder="e.g. SaaS founders" {...register("audience")} />
              </Field>
              <Field label="Topic" error={errors.topic?.message}>
                <Input placeholder="e.g. Product launch strategy" {...register("topic")} />
              </Field>
              <Field label="Product / service" error={errors.product?.message}>
                <Input placeholder="e.g. GrowthCo Pro" {...register("product")} />
              </Field>
              <Field label="CTA" error={errors.cta?.message}>
                <Input placeholder="e.g. Save for your next client consult" {...register("cta")} />
              </Field>

              <Field label="Content type" error={errors.contentType?.message}>
                <Select value={values.contentType} onValueChange={(v) => setValue("contentType", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Select a content type" /></SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Reference materials" description="Pulled from Brand Reference Library.">
                <div className="rounded-md border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                  Brand Guidelines v3.pdf · Founder voice notes.txt · Approved ingredient language
                </div>
              </Field>

              <Field label="Additional notes">
                <Textarea placeholder="Keep it educational. No medical claims. Mention pro-only formula tier." {...register("notes")} />
              </Field>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate content
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <ContentPreview draft={draft} loading={loading} onRegenerate={handleSubmit(onSubmit)} />
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: The generator uses your Brand Reference Library + Knowledge Memory. Add more references to make outputs more specific to GrowthCo.
      </p>
    </div>
  );
}

function Field({
  label,
  description,
  error,
  children,
}: {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
