import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-options";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(role: string) {
  const session = await requireAuth();
  if (session.user?.role !== role && session.user?.role !== "Admin") {
    redirect("/");
  }
  return session;
}
