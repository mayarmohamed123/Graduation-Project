/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "epharmahubimages2025.blob.core.windows.net",
      },
    ],
  },
};

export default nextConfig;
