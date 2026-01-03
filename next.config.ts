/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["imagetestyasmin.blob.core.windows.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagetestyasmin.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
  experimental: {
    // other flags here
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://webadd-avgnfdemdqcffecu.canadacentral-01.azurewebsites.net/api/:path*",
      },
      {
        source: "/hubs/:path*",
        destination:
          "https://unendingly-unfoul-emmy.ngrok-free.dev/hubs/:path*",
      },
    ];
  },
};

export default nextConfig;
