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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://webadd-avgnfdemdqcffecu.canadacentral-01.azurewebsites.net";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/hubs/:path*",
        destination: `${backendUrl}/hubs/:path*`,
      },
    ];
  },
};

export default nextConfig;
