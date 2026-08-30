"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Upload, FileText, Image as ImageIcon, Link2, MoreHorizontal, Archive, Trash2, Download } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { brandReferences } from "@/lib/mock/data";
import { REFERENCE_CATEGORIES } from "@/lib/constants";
import type { BrandReference } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const typeIcon: Record<string, React.ElementType> = {
  PDF: FileText,
  Image: ImageIcon,
  Text: FileText,
  Video: ImageIcon,
};

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState<BrandReference[]>(brandReferences);

  const filtered = useMemo(
    () => (activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory)),
    [items, activeCategory]
  );

  const columns: ColumnDef<BrandReference>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "File",
        cell: ({ row }) => {
          const Icon = typeIcon[row.original.type] ?? FileText;
          return (
            <span className="flex items-center gap-2 font-medium">
              <Icon className="h-4 w-4 text-muted-foreground" />
              {row.original.name}
            </span>
          );
        },
      },
      { accessorKey: "type", header: "Type" },
      { accessorKey: "category", header: "Category" },
      {
        id: "tags",
        header: "Tags",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.tags.map((tag) => (
              <Badge key={tag} variant="muted" className="text-xs">{tag}</Badge>
            ))}
          </div>
        ),
      },
      { accessorKey: "uploadedBy", header: "Uploaded by" },
      { accessorKey: "date", header: "Date" },
      { accessorKey: "usedFor", header: "Used for" },
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
              <DropdownMenuItem onClick={() => toast.success("Download started")}>
                <Download className="h-4 w-4" /> Download
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

  const categories = ["All", ...REFERENCE_CATEGORIES];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brand Reference Library"
        description="Anything you add here trains every AI output — content, scripts, image prompts, outreach."
        actions={
          <Button size="sm" onClick={() => toast.info("Upload dialog")}>
            <Upload className="h-4 w-4" /> Upload files
          </Button>
        }
      />

      {/* Upload zone */}
      <Card className="border-dashed">
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Drag & drop files here</p>
              <p className="text-xs text-muted-foreground">
                PDFs, docs, images, screenshots, social posts, product images, captions, style references…
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.info("File picker")}>
                Browse files
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.info("Paste URL")}>
                <Link2 className="h-4 w-4" /> Paste from URL
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
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

      <div>
        <p className="mb-3 text-sm text-muted-foreground">
          {activeCategory === "All" ? "All references" : activeCategory} · {filtered.length} files
        </p>
        <DataTable columns={columns} data={filtered} pageSize={10} />
      </div>
    </div>
  );
}
