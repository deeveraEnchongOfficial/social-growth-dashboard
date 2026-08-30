"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Sparkles, Download, RotateCw, Save, Send, ShieldCheck } from "lucide-react";
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
import { imageBriefSchema, type ImageBriefValues } from "@/lib/schemas";
import { IMAGE_PURPOSES, PLATFORMS, ASPECT_RATIOS, IMAGE_TYPES } from "@/lib/constants";
import { useDropdownValues } from "@/lib/hooks/use-dropdown-values";
import { sendToApproval } from "@/lib/approval-helpers";
import type { GeneratedImage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ImagesPage() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { values: dv } = useDropdownValues();
  const searchParams = useSearchParams();

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

  // Pre-fill topic from query param (e.g. from Content Generator)
  useEffect(() => {
    const topic = searchParams.get("topic");
    if (topic) {
      setValue("topic", decodeURIComponent(topic), { shouldValidate: true });
    }
  }, [searchParams, setValue]);

  const purposes = dv?.images.purposes ?? IMAGE_PURPOSES;
  const platforms = dv?.images.platforms ?? PLATFORMS;
  const aspectRatios = dv?.images.aspectRatios ?? ASPECT_RATIOS;
  const imageTypes = dv?.images.imageTypes ?? IMAGE_TYPES;

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
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Image brief</CardTitle>
              <AiFillButton
                formType="images"
                onFill={(fields) => {
                  (Object.keys(fields) as (keyof ImageBriefValues)[]).forEach((key) => {
                    setValue(key, fields[key as string] as never, { shouldValidate: true });
                  });
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Image purpose" error={errors.purpose?.message}>
                <Select value={values.purpose} onValueChange={(v) => setValue("purpose", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {purposes.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Platform" error={errors.platform?.message}>
                  <Select value={values.platform} onValueChange={(v) => setValue("platform", v, { shouldValidate: true })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Aspect ratio" error={errors.aspectRatio?.message}>
                  <Select value={values.aspectRatio} onValueChange={(v) => setValue("aspectRatio", v, { shouldValidate: true })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {aspectRatios.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
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
                    {imageTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
              {images.map((img, idx) => (
                <ImageCard key={img.id} image={img} delay={idx * 1500} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ImageCard({ image, delay = 0 }: { image: GeneratedImage; delay?: number }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [retryKey, setRetryKey] = useState(0);
  const [visible, setVisible] = useState(delay === 0);
  const [currentUrl, setCurrentUrl] = useState(image.imageUrl);
  const [regenerating, setRegenerating] = useState(false);
  const MAX_RETRIES = 3;

  // Stagger initial image loading to avoid hitting Pollinations.ai
  // with all 4 requests at the same time (which causes rate-limiting).
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  // Retry loading the image after a delay when it fails.
  useEffect(() => {
    if (imgError && retryCount < MAX_RETRIES) {
      const retryDelay = (retryCount + 1) * 2000;
      const timer = setTimeout(() => {
        setImgError(false);
        setRetryCount((c) => c + 1);
        setRetryKey((k) => k + 1);
      }, retryDelay);
      return () => clearTimeout(timer);
    }
  }, [imgError, retryCount]);

  /** Regenerate the image by swapping the seed in the Pollinations URL. */
  function handleRegenerate() {
    if (!image.imageUrl) return;
    const newSeed = Math.floor(Math.random() * 1000000);
    const url = new URL(image.imageUrl);
    url.searchParams.set("seed", String(newSeed));
    setCurrentUrl(url.toString());
    setImgLoaded(false);
    setImgError(false);
    setRetryCount(0);
    setRetryKey((k) => k + 1);
    setRegenerating(true);
  }

  return (
    <Card className="overflow-hidden">
      <div className={cn("relative aspect-square bg-gradient-to-br", image.gradient)}>
        {currentUrl && !imgError && visible && (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/50">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">
                  {regenerating ? "Regenerating…" : retryCount > 0 ? `Retrying… (${retryCount}/${MAX_RETRIES})` : "Generating image…"}
                </p>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={retryKey}
              src={currentUrl}
              alt={image.title}
              className="absolute inset-0 h-full w-full object-cover"
              onLoad={() => { setImgLoaded(true); setRegenerating(false); }}
              onError={() => { setImgError(true); setRegenerating(false); }}
            />
          </>
        )}
        {currentUrl && (!visible || (imgError && retryCount < MAX_RETRIES)) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/50">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">
              {regenerating ? "Regenerating…" : "Generating image…"}
            </p>
          </div>
        )}
        {currentUrl && imgError && retryCount >= MAX_RETRIES && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImagePlus className="h-6 w-6" />
            <p className="text-xs">Image unavailable</p>
          </div>
        )}
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
          <Button variant="outline" size="sm" disabled={regenerating} onClick={handleRegenerate}>
            {regenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCw className="h-3.5 w-3.5" />} Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Saved")}>
            <Save className="h-3.5 w-3.5" /> Save
          </Button>
          <Button size="sm" onClick={async () => {
            const result = await sendToApproval({
              type: "Images",
              title: image.title,
              preview: image.description,
              aiSource: "AI · image-gen",
              brandSafety: `Brand fit ${image.brandFitScore}%`,
            });
            if (result.success) toast.success("Sent to Approval Queue");
            else toast.error(result.error || "Failed to send to approval");
          }}>
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
