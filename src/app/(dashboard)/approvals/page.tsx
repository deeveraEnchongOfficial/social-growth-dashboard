"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Sparkles, ExternalLink, Pencil, RotateCw, Calendar, X, Check, Send, Loader2, RefreshCw, Trash2, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/states";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { APPROVAL_TYPES } from "@/lib/constants";
import { useDropdownValues } from "@/lib/hooks/use-dropdown-values";
import type { ApprovalItem, ApprovalStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const typeIcon: Record<string, string> = {
  Content: "📝",
  Images: "🖼️",
  Scripts: "🎬",
  "Repurposed Posts": "🔁",
  Outreach: "✉️",
  "Prospect Lists": "📋",
};

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { values: dv } = useDropdownValues();
  const approvalTypes = dv?.approvals.types ?? APPROVAL_TYPES;
  const [confirm, setConfirm] = useState<{
    open: boolean;
    action: string;
    item?: ApprovalItem;
  }>({ open: false, action: "", item: undefined });

  /** Fetch approval items from the API. */
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/approvals", { credentials: "same-origin" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      toast.error("Failed to load approval items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filtered = useMemo(
    () => (activeTab === "All" ? items : items.filter((i) => i.type === activeTab)),
    [items, activeTab]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: items.length };
    for (const t of approvalTypes) map[t] = items.filter((i) => i.type === t).length;
    return map;
  }, [items, approvalTypes]);

  /** Update an item's status in the database. */
  async function updateStatus(id: string, status: ApprovalStatus) {
    try {
      const res = await fetch(`/api/approvals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ status, reviewer: "Alex M." }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status, reviewer: "Alex M." } : i))
      );
    } catch {
      toast.error("Failed to update status");
    }
  }

  async function deleteItem(id: string) {
    try {
      const res = await fetch(`/api/approvals/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Item deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function handleAction(action: string, item: ApprovalItem) {
    const messages: Record<string, string> = {
      Approve: `${item.title} approved`,
      Reject: `${item.title} rejected`,
      Schedule: `${item.title} scheduled`,
      Send: `${item.title} sent`,
      Regenerate: `Regenerating ${item.title}…`,
      Edit: `Opening editor for ${item.title}`,
      Open: `Opening ${item.title}`,
    };

    if (action === "Approve") {
      await updateStatus(item.id, "Approved");
    } else if (action === "Reject") {
      await updateStatus(item.id, "Rejected");
    } else if (action === "Schedule") {
      await updateStatus(item.id, "Scheduled");
    } else if (action === "Send") {
      await updateStatus(item.id, "Sent");
    }

    toast.success(messages[action] ?? action);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Approval Queue"
        description="One place to review everything the AI generates before it goes out."
        actions={
          <Button size="sm" variant="outline" onClick={fetchItems} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/60 p-1">
          <TabsTrigger value="All" className="text-xs">
            All ({counts.All})
          </TabsTrigger>
          {approvalTypes.map((type) => (
            <TabsTrigger key={type} value={type} className="text-xs">
              {type} ({counts[type] ?? 0})
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4 space-y-3">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Nothing in this queue"
              description="Approved and rejected items move out of the queue. Generate new content to see items here."
            />
          ) : (
            filtered.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base">{typeIcon[item.type] ?? "📄"}</span>
                        <span className="text-xs font-medium text-muted-foreground">{item.type}</span>
                        <StatusBadge status={item.status} />
                        <span className="text-xs text-muted-foreground">{item.aiSource}</span>
                        <span className="text-xs text-muted-foreground">· {item.createdAt}</span>
                        <span className="text-xs text-muted-foreground">· Reviewer: {item.reviewer}</span>
                      </div>
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="line-clamp-1 text-sm text-muted-foreground">{item.preview}</p>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3 text-primary" />
                        Brand-safety: {item.brandSafety}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-1.5">
                      <ActionButton icon={ExternalLink} label="Open" onClick={() => handleAction("Open", item)} variant="ghost" />
                      <ActionButton icon={Pencil} label="Edit" onClick={() => handleAction("Edit", item)} variant="ghost" />
                      <ActionButton icon={RotateCw} label="Regenerate" onClick={() => handleAction("Regenerate", item)} variant="ghost" />
                      <ActionButton icon={Calendar} label="Schedule" onClick={() => handleAction("Schedule", item)} variant="outline" />
                      <ActionButton
                        icon={X}
                        label="Reject"
                        onClick={() => setConfirm({ open: true, action: "Reject", item })}
                        variant="outline"
                        destructive
                      />
                      <ActionButton
                        icon={Check}
                        label="Approve"
                        onClick={() => setConfirm({ open: true, action: "Approve", item })}
                        variant="success"
                      />
                      <ActionButton icon={Send} label="Send" onClick={() => handleAction("Send", item)} variant="default" />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </Tabs>

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={(open) => setConfirm((c) => ({ ...c, open }))}
        title={`${confirm.action} "${confirm.item?.title ?? ""}"?`}
        description={
          confirm.action === "Reject"
            ? "This will mark the item as rejected. You can regenerate it later."
            : "This will update the item status and notify the relevant team members."
        }
        confirmLabel={confirm.action}
        destructive={confirm.action === "Reject"}
        onConfirm={() => confirm.item && handleAction(confirm.action, confirm.item)}
      />
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant,
  destructive,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant: "ghost" | "outline" | "default" | "success";
  destructive?: boolean;
}) {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className={cn("h-7 gap-1 text-xs", destructive && "text-destructive hover:text-destructive")}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Button>
  );
}
