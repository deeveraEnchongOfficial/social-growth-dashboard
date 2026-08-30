"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Sparkles, Download, RotateCw, Save, Send, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
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
import { imageBriefSchema, type ImageBriefValues } from "@/lib/schemas";
import { IMAGE_PURPOSES, PLATFORMS, ASPECT_RATIOS, IMAGE_TYPES } from "@/lib/constants";
import type { GeneratedImage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ImagesPage() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ImageBriefValues>({
    resolver: zodResolver(imageBriefSchema),
    defaultValues: {
      purpose: "",
      platform: "",
      aspectRatio: "",
      imageType: "",
    },
  });

  const values = watch();

  async function onSubmit(data: ImageBriefValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Generation failed");
      const json = await res.json();
      setImages(json.images);
      toast.success("4 variants generated");
    } catch {
      toast.error("Generation failed — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Image Studio"
        description="Generate on-brand visuals using OpenAI Image 2. Brand-aligned, approval-gated."
        actions={
          <Button onClick={handleSubmit(onSubmit)} disabled={loading} size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate 4 variants
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Brief */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Image brief</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Image purpose" error={errors.purpose?.message}>
                <Select value={values.purpose} onValueChange={(v) => setValue("purpose", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {IMAGE_PURPOSES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
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
                <Field label="Aspect ratio" error={errors.aspectRatio?.message}>
                  <Select value={values.aspectRatio} onValueChange={(v) => setValue("aspectRatio", v, { shouldValidate: true })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {ASPECT_RATIOS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Content topic" error={errors.topic?.message}>
                <Input placeholder="e.g. Product launch education" {...register("topic")} />
              </Field>
              <Field label="Brand style" error={errors.brandStyle?.message}>
                <Input placeholder="e.g. Editorial, clean, modern" {...register("brandStyle")} />
              </Field>
              <Field label="Color palette" error={errors.palette?.message}>
                <Input placeholder="e.g. Neutral, beige, soft gold" {...register("palette")} />
              </Field>
              <Field label="Product / service" error={errors.product?.message}>
                <Input placeholder="e.g. GrowthCo Pro" {...register("product")} />
              </Field>
              <Field label="Visual references" description="From Brand Reference Library.">
                <div className="rounded-md border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                  Brand Guidelines v3.pdf · Product hero.jpg
                </div>
              </Field>
              <Field label="Prompt notes">
                <Textarea placeholder="Clean modern workspace. No people. Leave top-left negative space for headline." {...register("promptNotes")} />
              </Field>
              <Field label="Image type" error={errors.imageType?.message}>
                <Select value={values.imageType} onValueChange={(v) => setValue("imageType", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {IMAGE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate 4 variants
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Generated images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-start gap-2 rounded-md bg-warning/10 p-3 text-xs text-warning">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Brand-safety guardrail: Generated visuals are for brand creative and educational use only. Do not create fake reviews, fake testimonials, or fake UGC.</span>
          </div>

          {loading ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Generating 4 on-brand variants…</p>
              </CardContent>
            </Card>
          ) : images.length === 0 ? (
            <Card>
              <CardContent className="py-20 text-center">
                <ImagePlus className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">No images generated yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Fill in the brief and click Generate 4 variants.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {images.map((img) => (
                <ImageCard key={img.id} image={img} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ImageCard({ image }: { image: GeneratedImage }) {
  return (
    <Card className="overflow-hidden">
      <div className={cn("relative aspect-square bg-gradient-to-br", image.gradient)}>
        <div className="absolute left-3 top-3 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold backdrop-blur">
          Brand fit {image.brandFitScore}%
        </div>
        <div className="absolute bottom-3 right-3 rounded-md bg-background/90 px-2 py-1 text-xs backdrop-blur">
          {image.aspectRatio}
        </div>
      </div>
      <CardContent className="space-y-3 p-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">{image.title}</p>
          <p className="text-xs text-muted-foreground">{image.description}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button variant="outline" size="sm" onClick={() => toast.success("Download started")}>
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Regenerating…")}>
            <RotateCw className="h-3.5 w-3.5" /> Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Saved")}>
            <Save className="h-3.5 w-3.5" /> Save
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
