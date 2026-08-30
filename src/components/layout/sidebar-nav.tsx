"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { NAV_GROUPS, BRAND_NAME, PRODUCT_NAME } from "@/lib/constants";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          {BRAND_NAME[0]}
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-foreground">{BRAND_NAME}</div>
          <div className="text-xs text-sidebar-foreground/70">{PRODUCT_NAME}</div>
        </div>
      </div>

      <div className="mx-3 mb-3 flex items-center gap-2 rounded-md bg-sidebar-accent px-3 py-2 text-xs text-sidebar-foreground/80">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        <span className="font-medium">Brand-safe mode</span>
        <span className="text-sidebar-foreground/50">· Nothing sends without approval</span>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-5 pb-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = getIcon(item.icon);
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          active
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
