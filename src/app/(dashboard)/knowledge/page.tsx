"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Archive, Trash2, Pencil, Brain } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AiFillButton } from "@/components/shared/ai-fill-button";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
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
import { knowledgeEntries } from "@/lib/mock/data";
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
  const [items, setItems] = useState<KnowledgeEntry[]>(knowledgeEntries);
  const [activeFilter, setActiveFilter] = useState("All");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<KnowledgeEntryValues>({
    resolver: zodResolver(knowledgeEntrySchema),
    defaultValues: { category: "", priority: "" },
  });

  const values = watch();

  const filtered = useMemo(() => {
    if (activeFilter === "All") return items;
    if (activeFilter === "Active") return items.filter((i) => i.status === "Active");
    if (activeFilter === "Archived") return items.filter((i) => i.status === "Archived");
    return items.filter((i) => i.priority === activeFilter);
  }, [items, activeFilter]);

  function onSubmit(data: KnowledgeEntryValues) {
    const newEntry: KnowledgeEntry = {
      id: `k_${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category as KnowledgeEntry["category"],
      priority: data.priority as Priority,
      updated: "Just now",
      usedIn: 0,
      status: "Active",
    };
    setItems((prev) => [newEntry, ...prev]);
    reset({ category: "", priority: "" });
    toast.success("Saved to AI memory");
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
      { accessorKey: "updated", header: "Updated" },
      {
        accessorKey: "usedIn",
        header: "Used in",
        cell: ({ row }) => <span className="tabular-nums">{row.original.usedIn} outputs</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
              <DropdownMenuItem onClick={() => toast.info("Edit mode")}>
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setItems((prev) =>
                    prev.map((i) =>
                      i.id === row.original.id ? { ...i, status: "Archived" } : i
                    )
                  );
                  toast.success("Archived");
                }}
              >
                <Archive className="h-4 w-4" /> Archive
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setItems((prev) => prev.filter((i) => i.id !== row.original.id));
                  toast.success("Deleted");
                }}
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
        title="Business Knowledge Memory"
        description="Anything you teach the AI here shapes every future caption, script, image prompt, and outreach message."
        actions={
          <Button size="sm" onClick={() => toast.info("Scroll to form")}>
            <Plus className="h-4 w-4" /> Add knowledge
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
            <p className="text-xs text-muted-foreground">Teach the AI something about GrowthCo.</p>
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
              <Field label="Description" error={errors.description?.message}>
                <Textarea placeholder="Lead Q2 messaging around the product launch." {...register("description")} />
              </Field>
              <Field label="Related product / service">
                <Input placeholder="e.g. GrowthCo Pro" {...register("relatedProduct")} />
              </Field>
              <Field label="Approved messaging">
                <Textarea placeholder="Pre-approved phrasing…" {...register("approvedMessaging")} />
              </Field>
              <Field label="Phrases to avoid">
                <Textarea placeholder="No medical claims…" {...register("phrasesToAvoid")} />
              </Field>
              <Field label="Audience">
                <Input placeholder="e.g. SaaS founders" {...register("audience")} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start date">
                  <Input type="date" {...register("startDate")} />
                </Field>
                <Field label="Expiration (optional)">
                  <Input type="date" {...register("expiration")} />
                </Field>
              </div>
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4" /> Save to AI memory
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
          <DataTable columns={columns} data={filtered} pageSize={10} />
        </div>
      </div>
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
