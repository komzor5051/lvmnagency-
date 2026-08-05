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
      {
        // www served a full 200 copy of the site — a duplicate of every URL.
        // Collapse it onto the bare domain so link equity lands in one place.
        source: "/:path*",
        has: [{ type: "host", value: "www.vladlyamin.ru" }],
        destination: "https://vladlyamin.ru/:path*",
        permanent: true,
      },
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
      {
        // HSTS pins the HTTPS origin, which keeps http:// from competing with
        // https:// as a separate canonical host. The rest are baseline
        // hardening and carry no rendering side effects.
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
