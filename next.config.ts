import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Point Turbopack to THIS project — avoids confusion from /Users/lvmn/package-lock.json
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
