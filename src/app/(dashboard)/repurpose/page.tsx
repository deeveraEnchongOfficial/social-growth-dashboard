"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, Pencil, Check, Send, Repeat2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { repurposeBriefSchema, type RepurposeBriefValues } from "@/lib/schemas";
import { TONES } from "@/lib/constants";
import type { RepurposeVariant } from "@/lib/types";
import { toast } from "sonner";

const CAMPAIGN_GOALS = [
  "Educate professionals",
  "Drive saves",
  "Build founder authority",
  "Promote new launch",
] as const;

export default function RepurposePage() {
  const [variants, setVariants] = useState<RepurposeVariant[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RepurposeBriefValues>({
    resolver: zodResolver(repurposeBriefSchema),
    defaultValues: { campaignGoal: "", tone: "" },
  });

  const values = watch();

  async function onSubmit(data: RepurposeBriefValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Generation failed");
      const json = await res.json();
      setVariants(json.variants);
      toast.success("Platform versions generated");
    } catch {
      toast.error("Generation failed — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Platform Repurposing"
        description="One idea becomes a full content campaign — tuned for each channel."
        actions={
          <Button onClick={handleSubmit(onSubmit)} disabled={loading} size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate platform versions
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Source idea */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Source idea</CardTitle>
              <AiFillButton
                formType="repurpose"
                onFill={(fields) => {
                  (Object.keys(fields) as (keyof RepurposeBriefValues)[]).forEach((key) => {
                    setValue(key, fields[key as string] as never, { shouldValidate: true });
                  });
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">What we&apos;re remixing.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Original content" description="Paste a post, script, or rough idea." error={errors.originalContent?.message}>
                <Textarea
                  rows={5}
                  placeholder="If your landing page bounce rate is above 60%, that's a messaging signal — not a traffic problem. Here's a 30-second audit we teach in our onboarding."
                  {...register("originalContent")}
                />
              </Field>
              <Field label="Campaign goal" error={errors.campaignGoal?.message}>
                <Select value={values.campaignGoal} onValueChange={(v) => setValue("campaignGoal", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {CAMPAIGN_GOALS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Audience" error={errors.audience?.message}>
                <Input placeholder="e.g. SaaS founders" {...register("audience")} />
              </Field>
              <Field label="Product / service" error={errors.product?.message}>
                <Input placeholder="e.g. GrowthCo Pro" {...register("product")} />
              </Field>
              <Field label="Tone" error={errors.tone?.message}>
                <Select value={values.tone} onValueChange={(v) => setValue("tone", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="CTA" error={errors.cta?.message}>
                <Input placeholder="e.g. Save for your next consult" {...register("cta")} />
              </Field>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate platform versions
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Variants */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Generating channel variants…</p>
              </CardContent>
            </Card>
          ) : variants.length === 0 ? (
            <Card>
              <CardContent className="py-20 text-center">
                <Repeat2 className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">No variants yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Paste your source idea and generate platform versions.</p>
              </CardContent>
            </Card>
          ) : (
            variants.map((variant) => (
              <VariantCard key={variant.id} variant={variant} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function VariantCard({ variant }: { variant: RepurposeVariant }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Badge variant="default">{variant.platform}</Badge>
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Hook</Label>
          <p className="text-sm font-medium italic">{variant.hook}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Copy</Label>
          <p className="text-sm leading-relaxed text-foreground/90">{variant.copy}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">CTA</Label>
          <p className="text-sm">{variant.cta}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">Visual</Label>
          <p className="text-sm text-muted-foreground">{variant.visual}</p>
        </div>
        <div className="flex flex-wrap gap-2 border-t pt-3">
          <Button variant="outline" size="sm" onClick={() => toast.info("Edit mode")}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Approved")}>
            <Check className="h-3.5 w-3.5" /> Approve
          </Button>
          <Button size="sm" onClick={() => toast.success("Sent to Approval Queue")}>
            <Send className="h-3.5 w-3.5" /> Send to approval
          </Button>
        </div>
      </CardContent>
    </Card>
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
