import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    implementation: "sass-embedded",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`, // Proxy all /api requests to unified backend
      },
    ];
  },
};

export default nextConfig;
