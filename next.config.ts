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
      {
        protocol: "https",
        hostname: "unendingly-unfoul-emmy.ngrok-free.dev",
      },
    ],
  },
  experimental: {
    // other flags here
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://unendingly-unfoul-emmy.ngrok-free.dev";
    return {
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
        {
          source: "/hubs/:path*",
          destination: `${backendUrl}/hubs/:path*`,
        },
      ],
      fallback: [
        {
          source: "/:path*",
          destination: `${backendUrl}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
