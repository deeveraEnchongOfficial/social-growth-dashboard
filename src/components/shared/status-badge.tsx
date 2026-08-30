import type { ApprovalStatus, ListStatus, OutreachStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "success" | "warning" | "muted" | "outline"
> = {
  // approval / list
  New: "default",
  Drafted: "secondary",
  "Needs Review": "warning",
  "Needs Revision": "warning",
  Shortlisted: "outline",
  Approved: "success",
  Scheduled: "default",
  Posted: "success",
  Sent: "success",
  Rejected: "destructive",
  "Do Not Contact": "destructive",
  // outreach
  Queued: "secondary",
  Sending: "warning",
  Failed: "destructive",
  Replied: "success",
  "Follow Up Needed": "warning",
  // misc
  Active: "success",
  Archived: "muted",
  Connected: "success",
  Disconnected: "muted",
  Paused: "warning",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ApprovalStatus | ListStatus | OutreachStatus | string;
  className?: string;
}) {
  const variant = statusVariant[status] ?? "secondary";
  return (
    <Badge variant={variant} className={cn(className)}>
      {status}
    </Badge>
  );
}
