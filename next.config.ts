import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Submissions carry up to 4 photos in one multipart form.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
