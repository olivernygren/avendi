import type { NextConfig } from "next";

export default {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
} as NextConfig;
