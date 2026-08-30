import { Inbox, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 py-14 text-center",
        className
      )}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg border bg-muted/20 px-6 py-14 text-sm text-muted-foreground",
        className
      )}
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-14 text-center",
        className
      )}
    >
      <AlertTriangle className="h-5 w-5 text-destructive" />
      <p className="text-sm font-medium text-destructive">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm font-medium text-primary hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
