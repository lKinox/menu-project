import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'g5iyghh4wd2gjokm.public.blob.vercel-storage.com',
        port: '', // Deja vacío para que coincida con cualquier puerto
        pathname: '/**', // Permite cualquier subruta
      },
    ],
  },
};

export default nextConfig;
