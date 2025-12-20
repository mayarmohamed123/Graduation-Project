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
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://unendingly-unfoul-emmy.ngrok-free.dev/api/:path*",
      },
    ];
  },
};

export default nextConfig;
