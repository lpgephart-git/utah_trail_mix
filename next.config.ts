import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Photo uploads go through Server Actions; the default body cap is 1 MB.
    // Our image limits are 8 MB (posts) / 5 MB (avatars) — leave room for
    // multipart overhead.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
