import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@electric-sql/pglite-react", // Optional
    "@electric-sql/pglite",
  ],
};

export default nextConfig;
