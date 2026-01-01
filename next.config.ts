/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "epharmahubimages2025.blob.core.windows.net",
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
  cacheComponents: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://unendingly-unfoul-emmy.ngrok-free.dev/api/:path*",
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
