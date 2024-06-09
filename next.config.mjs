/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "knowing-ptarmigan-478.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
