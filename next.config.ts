import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "framer-motion": "framer-motion",
    },
    root: process.cwd(),
  },
  transpilePackages: ["framer-motion"],
};

export default nextConfig;
