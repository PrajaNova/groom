import type { NextConfig } from "next";

// Trigger restart 2

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
    const BOOKING_URL =
      process.env.BOOKING_SERVICE_URL || "http://localhost:3003";
    const GROOM_URL = process.env.GROOM_SERVICE_URL || "http://localhost:3004";
    const USER_URL = process.env.USER_SERVICE_URL || "http://localhost:3002";

    return [
      {
        source: "/api/bookings/:path*",
        destination: `${BOOKING_URL}/api/bookings/:path*`, // booking-ms
      },
      {
        source: "/api/blogs/:path*",
        destination: `${GROOM_URL}/api/blogs/:path*`, // groom-ms (now with /api prefix)
      },
      {
        source: "/api/confessions/:path*",
        destination: `${GROOM_URL}/api/confessions/:path*`, // groom-ms (now with /api prefix)
      },
      {
        source: "/api/jaas-token",
        destination: `${GROOM_URL}/api/jaas-token`, // groom-ms (now with /api prefix)
      },
      {
        source: "/api/user/:path*",
        destination: `${USER_URL}/api/user/:path*`, // user-ms
      },
      {
        source: "/api/auth/:path*",
        destination: `${USER_URL}/api/auth/:path*`, // user-ms
      },
    ];
  },
};

export default nextConfig;
