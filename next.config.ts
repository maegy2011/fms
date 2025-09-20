import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production-friendly configuration
  typescript: {
    // Don't ignore build errors in production
    ignoreBuildErrors: false,
  },
  // Enable React strict mode for better error detection
  reactStrictMode: true,
  // Remove development-specific webpack config for production
  webpack: (config, { dev }) => {
    if (!dev) {
      // Production optimizations
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }
    return config;
  },
  eslint: {
    // Don't ignore ESLint errors in production builds
    ignoreDuringBuilds: false,
  },
  // Environment variables that should be available to the client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Handle images and other assets
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
};

export default nextConfig;
