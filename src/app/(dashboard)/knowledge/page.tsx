"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Plus, MoreHorizontal, Archive, Trash2, Pencil, Brain,
  Eye, Code, Copy, Check, X, Loader2, RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AiFillButton } from "@/components/shared/ai-fill-button";
import { MarkdownPreview } from "@/components/shared/markdown-preview";
import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { knowledgeEntrySchema, type KnowledgeEntryValues } from "@/lib/schemas";
import { KNOWLEDGE_CATEGORIES } from "@/lib/constants";
import type { KnowledgeEntry, Priority } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const priorityVariant: Record<Priority, string> = {
  Critical: "text-destructive",
  High: "text-warning",
  Medium: "text-primary",
  Low: "text-muted-foreground",
};

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<KnowledgeEntryValues>({
    resolver: zodResolver(knowledgeEntrySchema),
    defaultValues: { category: "", priority: "", content: "" },
  });

  const values = watch();

  /** Fetch knowledge entries from the API. */
  async function fetchEntries() {
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data.entries || []);
    } catch {
      toast.error("Failed to load knowledge entries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return items;
    if (activeFilter === "Active") return items.filter((i) => i.status === "Active");
    if (activeFilter === "Archived") return items.filter((i) => i.status === "Archived");
    return items.filter((i) => i.priority === activeFilter);
  }, [items, activeFilter]);

  function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  async function onSubmit(data: KnowledgeEntryValues) {
    setSaving(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      const json = await res.json();
      setItems((prev) => [json.entry, ...prev]);
      reset({ category: "", priority: "", content: "" });
      setPreviewMode(false);
      toast.success("Saved to AI memory");
    } catch {
      toast.error("Failed to save — try again");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: "Active" | "Archived") {
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status } : i))
      );
      toast.success(status === "Archived" ? "Archived" : "Activated");
    } catch {
      toast.error("Failed to update");
    }
  }

  async function deleteEntry(id: string) {
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function copyContent(content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Markdown copied");
    } catch {
      toast.error("Failed to copy");
    }
  }

  const columns: ColumnDef<KnowledgeEntry>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="max-w-xs">
            <p className="font-medium">{row.original.title}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground">{row.original.description}</p>
          </div>
        ),
      },
      { accessorKey: "category", header: "Category" },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <span className={cn("text-xs font-semibold", priorityVariant[row.original.priority])}>
            {row.original.priority}
          </span>
        ),
      },
      {
        accessorKey: "wordCount",
        header: "Words",
        cell: ({ row }) => (
          <span className="tabular-nums text-xs text-muted-foreground">
            {row.original.wordCount ?? "—"}
          </span>
        ),
      },
      { accessorKey: "updated", header: "Updated" },
      {
        accessorKey: "usedIn",
        header: "Used in",
        cell: ({ row }) => <span className="tabular-nums">{row.original.usedIn} outputs</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Select
            value={row.original.status}
            onValueChange={(v) => updateStatus(row.original.id, v as "Active" | "Archived")}
          >
            <SelectTrigger className="h-7 w-[110px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedEntry(row.original)}>
                <Eye className="h-4 w-4" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyContent(row.original.content)}>
                <Copy className="h-4 w-4" /> Copy MD
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Edit mode")}>
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              {row.original.status === "Active" ? (
                <DropdownMenuItem
                  onClick={() => updateStatus(row.original.id, "Archived")}
                >
                  <Archive className="h-4 w-4" /> Archive
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => updateStatus(row.original.id, "Active")}
                >
                  <RefreshCw className="h-4 w-4" /> Activate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => deleteEntry(row.original.id)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const filters = ["All", "Active", "Archived", "Critical", "High"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brand Reference Library"
        description="Paste markdown to train the AI. Everything here shapes every caption, script, image prompt, and outreach message."
        actions={
          <Button size="sm" variant="outline" onClick={fetchEntries} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Add form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-4 w-4 text-primary" />
                Add new knowledge
              </CardTitle>
              <AiFillButton
                formType="knowledge"
                onFill={(fields) => {
                  (Object.keys(fields) as (keyof KnowledgeEntryValues)[]).forEach((key) => {
                    setValue(key, fields[key as string] as never, { shouldValidate: true });
                  });
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">Paste markdown text to train the AI.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Knowledge title" error={errors.title?.message}>
                <Input placeholder="e.g. Q2 product launch campaign" {...register("title")} />
              </Field>
              <Field label="Category" error={errors.category?.message}>
                <Select value={values.category} onValueChange={(v) => setValue("category", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {KNOWLEDGE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Priority level" error={errors.priority?.message}>
                <Select value={values.priority} onValueChange={(v) => setValue("priority", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["Low", "Medium", "High", "Critical"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Short description" error={errors.description?.message}>
                <Input placeholder="One-line summary of what this teaches the AI" {...register("description")} />
              </Field>

              {/* Markdown content input — paste only */}
              <Field label="Markdown content" error={errors.content?.message}>
                <div className="space-y-2">
                  {/* Toggle bar */}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewMode(!previewMode)}
                      disabled={!values.content}
                    >
                      {previewMode ? <Code className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {previewMode ? "Edit" : "Preview"}
                    </Button>
                    {values.content && (
                      <span className="text-xs text-muted-foreground">
                        {countWords(values.content)} words
                      </span>
                    )}
                  </div>

                  {/* Editor or Preview */}
                  {previewMode ? (
                    <div className="min-h-[200px] rounded-md border bg-background p-4">
                      {values.content ? (
                        <MarkdownPreview content={values.content} />
                      ) : (
                        <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
                      )}
                    </div>
                  ) : (
                    <Textarea
                      rows={12}
                      placeholder={"# Paste your markdown here\n\n## Section\n- Bullet point\n- Another point\n\n**Bold** and *italic* supported."}
                      className="font-mono text-xs"
                      {...register("content")}
                    />
                  )}
                </div>
              </Field>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Save to AI memory
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Knowledge base */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  activeFilter === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background hover:bg-accent"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {filtered.length} entries currently used in AI outputs.
          </p>
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : (
            <DataTable columns={columns} data={filtered} pageSize={10} />
          )}
        </div>
      </div>

      {/* View modal */}
      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedEntry(null)}
        >
          <Card
            className="max-h-[80vh] w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{selectedEntry.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{selectedEntry.description}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className={cn("text-xs font-semibold", priorityVariant[selectedEntry.priority])}>
                      {selectedEntry.priority}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{selectedEntry.category}</span>
                    {selectedEntry.wordCount != null && (
                      <>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{selectedEntry.wordCount} words</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyContent(selectedEntry.content)}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy MD"}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedEntry(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="max-h-[60vh] overflow-y-auto">
              <MarkdownPreview content={selectedEntry.content} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
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
