import type { NextConfig } from "next";
// Trigger restart

const nextConfig: NextConfig = {
  sassOptions: {
    implementation: "sass-embedded",
  },
  allowedDevOrigins: ["https://lottie.host/"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },  
  async rewrites() {
    return [
      {
        source: "/api/booking/:path*",
        destination: "http://localhost:3003/booking/:path*", // booking-ms (check if routes are prefixed with /booking or not)
      },
      {
        source: "/api/blogs/:path*",
        destination: "http://localhost:3004/blogs/:path*", // groom-ms
      },
      {
        source: "/api/confessions/:path*",
        destination: "http://localhost:3004/confessions/:path*", // groom-ms
      },
      {
        source: "/api/jaas-token",
        destination: "http://localhost:3004/jaas-token", // groom-ms
      },
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:3002/auth/:path*", // user-ms
      },
    ];
  },
};

export default nextConfig;
