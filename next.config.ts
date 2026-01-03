/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
        destination: "https://webadd-avgnfdemdqcffecu.canadacentral-01.azurewebsites.net/api/:path*",
      },
      {
        source: "/hubs/:path*",
        destination:
          "https://webadd-avgnfdemdqcffecu.canadacentral-01.azurewebsites.net/hubs/:path*",
      },
    ];
  },
};

export default nextConfig;
