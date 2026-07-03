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
  async rewrites() {
    // /api/robots holds the actual handler — Next's metadata-file convention
    // reserves the literal "/robots.txt" route path and conflicts with a
    // route handler declared at that exact path.
    return [
      { source: "/robots.txt", destination: "/api/robots" },
      { source: "/llms.txt", destination: "/api/llms" },
    ];
  },
  async headers() {
    return [
      {
        // RFC 8288 Link header: points agents at the llms.txt discovery doc.
        source: "/",
        headers: [
          { key: "Link", value: '</llms.txt>; rel="service-doc"' },
        ],
      },
    ];
  },
};

export default nextConfig;
