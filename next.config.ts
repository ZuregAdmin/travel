import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Submissions carry up to 8 photos (8 MB each) in one multipart form.
      bodySizeLimit: "70mb",
    },
  },
};

export default nextConfig;
