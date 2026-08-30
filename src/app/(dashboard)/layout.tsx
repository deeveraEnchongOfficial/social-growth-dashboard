import type { Metadata } from "next";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Topbar } from "@/components/layout/topbar";
import { requireAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "AI Growth Suite — Dashboard",
    template: "%s — AI Growth Suite",
  },
  description:
    "Brand-safe AI-powered social media growth, performance intelligence, and outreach.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const user = session.user;
  void user;

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r md:block">
        <div className="sticky top-0 h-screen">
          <SidebarNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
