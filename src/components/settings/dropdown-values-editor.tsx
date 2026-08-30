"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { DropdownValuesConfig } from "@/lib/config";
import { toast } from "sonner";

/**
 * Metadata for each module tab: which fields to show and their labels.
 */
const MODULE_FIELDS: Record<
  keyof DropdownValuesConfig,
  { label: string; fields: { key: string; label: string }[] }
> = {
  content: {
    label: "Content Generator",
    fields: [
      { key: "contentGoals", label: "Content goal" },
      { key: "platforms", label: "Platform" },
      { key: "tones", label: "Tone" },
      { key: "contentTypes", label: "Content type" },
    ],
  },
  scripts: {
    label: "Video Scripts",
    fields: [
      { key: "categories", label: "Category" },
      { key: "lengths", label: "Length" },
      { key: "speakers", label: "Speaker" },
      { key: "tones", label: "Tone" },
    ],
  },
  images: {
    label: "Image Studio",
    fields: [
      { key: "purposes", label: "Purpose" },
      { key: "platforms", label: "Platform" },
      { key: "aspectRatios", label: "Aspect ratio" },
      { key: "imageTypes", label: "Image type" },
    ],
  },
  repurpose: {
    label: "Repurposing",
    fields: [
      { key: "campaignGoals", label: "Campaign goal" },
      { key: "tones", label: "Tone" },
      { key: "platforms", label: "Platform" },
    ],
  },
  knowledge: {
    label: "Knowledge Memory",
    fields: [
      { key: "categories", label: "Category" },
      { key: "priorities", label: "Priority" },
    ],
  },
  outreach: {
    label: "Outreach",
    fields: [
      { key: "creatorCategories", label: "Creator category" },
      { key: "channels", label: "Channel" },
      { key: "types", label: "Message type" },
    ],
  },
  approvals: {
    label: "Approvals",
    fields: [
      { key: "types", label: "Item type" },
      { key: "statuses", label: "Status" },
    ],
  },
};

export function DropdownValuesEditor({
  values,
  onChange,
}: {
  values: DropdownValuesConfig;
  onChange: (values: DropdownValuesConfig) => void;
}) {
  const moduleKeys = Object.keys(MODULE_FIELDS) as (keyof DropdownValuesConfig)[];

  function addValue(module: keyof DropdownValuesConfig, field: string, value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    const current = values[module][field as keyof typeof values[typeof module]] as string[];
    if (current.includes(trimmed)) {
      toast.error("Value already exists");
      return;
    }
    onChange({
      ...values,
      [module]: {
        ...values[module],
        [field]: [...current, trimmed],
      },
    });
  }

  function removeValue(module: keyof DropdownValuesConfig, field: string, index: number) {
    const current = values[module][field as keyof typeof values[typeof module]] as string[];
    onChange({
      ...values,
      [module]: {
        ...values[module],
        [field]: current.filter((_, i) => i !== index),
      },
    });
  }

  return (
    <Tabs defaultValue="content">
      <TabsList className="flex-wrap">
        {moduleKeys.map((mk) => (
          <TabsTrigger key={mk} value={mk} className="text-xs">
            {MODULE_FIELDS[mk].label}
          </TabsTrigger>
        ))}
      </TabsList>

      {moduleKeys.map((mk) => (
        <TabsContent key={mk} value={mk} className="space-y-4">
          {MODULE_FIELDS[mk].fields.map((f) => (
            <DropdownFieldEditor
              key={f.key}
              label={f.label}
              values={values[mk][f.key as keyof typeof values[typeof mk]] as string[]}
              onAdd={(v) => addValue(mk, f.key, v)}
              onRemove={(i) => removeValue(mk, f.key, i)}
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function DropdownFieldEditor({
  label,
  values,
  onAdd,
  onRemove,
}: {
  label: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [input, setInput] = useState("");

  function handleAdd() {
    onAdd(input);
    setInput("");
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Existing values as removable chips */}
        <div className="flex flex-wrap gap-2">
          {values.length === 0 && (
            <p className="text-xs text-muted-foreground">No values yet — add one below.</p>
          )}
          {values.map((v, i) => (
            <span
              key={`${v}-${i}`}
              className="inline-flex items-center gap-1 rounded-md border bg-muted px-2 py-1 text-xs font-medium"
            >
              {v}
              <button
                onClick={() => onRemove(i)}
                className="ml-0.5 rounded-sm hover:bg-background hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add new value */}
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder={`Add new ${label.toLowerCase()}…`}
            className="h-8 text-sm"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAdd}
            disabled={!input.trim()}
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
