import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "e-healthhub-dfcjb0cuazc3crfj.australiaeast-01.azurewebsites.net",
        pathname: "/doctors/**",
      },
      {
        protocol: "https",
        hostname:
          "e-healthhub-dfcjb0cuazc3crfj.australiaeast-01.azurewebsites.net",
        pathname: "/pharmacies/**",
      },
    ],
  },
};

export default nextConfig;
