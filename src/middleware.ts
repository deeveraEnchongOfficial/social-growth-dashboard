import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    /*
     * Protect all routes except:
     * - /login (sign-in page)
     * - /api/auth (NextAuth endpoints)
     * - /api (other API routes — accessible without auth for now)
     * - /_next/static, /_next/image, /favicon.ico (static assets)
     */
    "/((?!login|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
