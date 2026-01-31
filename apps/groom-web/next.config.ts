import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    implementation: "sass-embedded",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/groom",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    const GROOM_URL = process.env.GROOM_SERVICE_URL || "http://localhost:3002";
    return [
      {
        source: "/api/:path*",
        destination: `${GROOM_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
