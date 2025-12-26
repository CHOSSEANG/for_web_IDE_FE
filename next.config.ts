// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://api.webicapp.com/:path*',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Disable symlinks to avoid EISDIR errors on Windows with special chars in path
    config.resolve.symlinks = false;

    return config;
  },
};

export default nextConfig;