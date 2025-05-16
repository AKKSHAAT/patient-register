import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "@electric-sql/pglite-react", // Optional
    "@electric-sql/pglite",
  ],
};

export default nextConfig;
