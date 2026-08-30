"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Plus, Menu, Search, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarNav } from "./sidebar-nav";
import { BRAND_NAME } from "@/lib/constants";
import { initials } from "@/lib/utils";
import { toast } from "sonner";

const createItems = [
  "Generate content",
  "Repurpose a post",
  "Generate video script",
  "Generate images",
  "Find creators",
  "Upload brand reference",
  "Add knowledge",
];

export function Topbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "";
  const userRole = session?.user?.role ?? "Reviewer";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mobile sidebar trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">{BRAND_NAME} navigation</SheetTitle>
          <SidebarNav />
        </SheetContent>
      </Sheet>

      <div className="hidden flex-1 items-center md:flex">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search content, creators, drafts…"
            className="h-9 w-full rounded-md border border-input bg-muted/40 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          onClick={() => toast.info("No new notifications")}
        >
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create New</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Create</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {createItems.map((item) => (
              <DropdownMenuItem
                key={item}
                onClick={() => toast.info(`Opening: ${item}`)}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar>
                <AvatarFallback>{initials(userName)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground">{userEmail}</span>
                <span className="mt-0.5 text-xs text-primary">{userRole}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info("Opening profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Opening settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
