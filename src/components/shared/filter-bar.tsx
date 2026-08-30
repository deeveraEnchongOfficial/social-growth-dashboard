"use client";

import { Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterBar({
  filters,
  onExport,
  onAiSummary,
  exportLabel = "Export",
  aiLabel = "Generate AI summary",
}: {
  filters: FilterConfig[];
  onExport?: () => void;
  onAiSummary?: () => void;
  exportLabel?: string;
  aiLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <Select key={filter.id} value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className="h-8 w-auto gap-1.5 text-xs">
              <span className="text-muted-foreground">{filter.label}:</span>
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => (onExport ? onExport() : toast.success("Export started"))}
          >
            <Download className="h-4 w-4" />
            {exportLabel}
          </Button>
        )}
        {onAiSummary && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => (onAiSummary ? onAiSummary() : toast.success("AI summary generated"))}
          >
            <Sparkles className="h-4 w-4" />
            {aiLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
