import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Point Turbopack to THIS project — avoids confusion from /Users/lvmn/package-lock.json
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: "/ai-audit", destination: "/audit", permanent: true },
      { source: "/employees", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
