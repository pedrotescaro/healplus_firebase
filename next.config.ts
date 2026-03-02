import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Treats these packages as external on the server to prevent bundling issues
  serverExternalPackages: [
    'genkit', 
    '@genkit-ai/googleai', 
    '@genkit-ai/next', 
    'wav',
    'firebase'
  ],
  webpack: (config, { isServer }) => {
    // Correctly resolve node_modules path
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ];

    // Fallbacks for client-side bundling of Node.js modules used by dependencies like Genkit/OpenTelemetry
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        perf_hooks: false,
        async_hooks: false,
        dgram: false,
        dns: false,
        http2: false,
        os: false,
      };
    }

    return config;
  },
};

export default nextConfig;
