/** @type {import('next').NextConfig} */
const nextConfig = {
  // Provide a fallback NEXTAUTH_URL during build-time prerendering so
  // NextAuth doesn't crash with `new URL('')` when the env var isn't set yet.
  // At runtime on Vercel, the real NEXTAUTH_URL (or VERCEL_URL) is used.
  env: {
    NEXTAUTH_URL:
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL ||
      "http://localhost:3000",
  },
};

export default nextConfig;
