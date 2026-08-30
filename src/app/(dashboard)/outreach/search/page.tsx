"use client";

import { useMemo, useState } from "react";
import { UserPlus, Mail, MessageCircle, Ban, Sparkles, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/states";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { creators } from "@/lib/mock/data";
import { CREATOR_CATEGORIES, PLATFORMS } from "@/lib/constants";
import { useDropdownValues } from "@/lib/hooks/use-dropdown-values";
import type { Creator } from "@/lib/types";
import { formatNumber, initials, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CreatorSearchPage() {
  const [category, setCategory] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [query, setQuery] = useState("");
  const [list, setList] = useState<Creator[]>(creators);
  const { values: dv } = useDropdownValues();
  const creatorCategories = dv?.outreach.creatorCategories ?? CREATOR_CATEGORIES;
  const platforms = dv?.outreach.channels ?? PLATFORMS;

  const filtered = useMemo(
    () =>
      list.filter(
        (c) =>
          (category === "all" || c.category === category) &&
          (platform === "all" || c.platform === platform) &&
          (query === "" ||
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.handle.toLowerCase().includes(query.toLowerCase()))
      ),
    [list, category, platform, query]
  );

  function updateStatus(id: string, status: Creator["listStatus"]) {
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, listStatus: status } : c)));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Creator & Professional Outreach Search"
        description="Powered by Tikhub. Real people for real partnerships — never fake UGC."
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-8 w-auto text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {creatorCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="h-8 w-auto text-xs">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Badge variant="muted" className="text-xs">Followers: 1k – 250k</Badge>
          <Badge variant="muted" className="text-xs">ER ≥ 4%</Badge>
          <Badge variant="muted" className="text-xs">US + UK</Badge>
          <Badge variant="muted" className="text-xs">Has email or DM</Badge>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search creators…"
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-md bg-primary/5 p-3 text-xs text-primary">
        <Sparkles className="h-4 w-4 shrink-0" />
        <span>AI helps find real people for real partnerships. It does not create fake UGC.</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No creators match your filters"
          description="Try widening your search or changing the category filter."
          icon={UserPlus}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onAddToList={() => {
                updateStatus(creator.id, "Shortlisted");
                toast.success(`${creator.name} added to list`);
              }}
              onDraftDm={() => toast.success(`DM drafted for ${creator.name}`)}
              onDraftEmail={() => toast.success(`Email drafted for ${creator.name}`)}
              onDoNotContact={() => {
                updateStatus(creator.id, "Do Not Contact");
                toast.info(`${creator.name} marked Do Not Contact`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CreatorCard({
  creator,
  onAddToList,
  onDraftDm,
  onDraftEmail,
  onDoNotContact,
}: {
  creator: Creator;
  onAddToList: () => void;
  onDraftDm: () => void;
  onDraftEmail: () => void;
  onDoNotContact: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Avatar className="h-11 w-11">
            <AvatarFallback className="bg-primary/15 text-sm">{initials(creator.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold">{creator.name}</h3>
              <StatusBadge status={creator.listStatus} />
            </div>
            <p className="text-xs text-muted-foreground">
              {creator.handle} · {creator.platform}
            </p>
            <p className="line-clamp-1 text-xs text-muted-foreground">{creator.bio}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <Stat label="Followers" value={formatNumber(creator.followers)} />
          <Stat label="ER" value={`${creator.engagementRate}%`} />
          <Stat label="Location" value={creator.location} />
        </div>

        <div className="mt-4 space-y-2 rounded-md bg-muted/40 p-3 text-xs">
          <p><span className="font-semibold text-muted-foreground">Why a fit: </span>{creator.fitReason}</p>
          <p><span className="font-semibold text-muted-foreground">Suggested angle: </span>{creator.suggestedAngle}</p>
          <p><span className="font-semibold text-muted-foreground">Contact: </span>{creator.contact} · {creator.contactSource}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Button variant="outline" size="sm" onClick={onAddToList} className="text-xs">
            <UserPlus className="h-3.5 w-3.5" /> Add to list
          </Button>
          <Button variant="outline" size="sm" onClick={onDraftDm} className="text-xs">
            <MessageCircle className="h-3.5 w-3.5" /> Draft DM
          </Button>
          <Button variant="outline" size="sm" onClick={onDraftEmail} className="text-xs">
            <Mail className="h-3.5 w-3.5" /> Draft email
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDoNotContact}
            className={cn("text-xs text-destructive hover:text-destructive")}
          >
            <Ban className="h-3.5 w-3.5" /> Do not contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/30 p-2 text-center">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
