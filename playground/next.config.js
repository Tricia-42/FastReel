const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants');
const createNextPluginPreval = require("next-plugin-preval/config");
const withNextPluginPreval = createNextPluginPreval();

/** @type {import('next').NextConfig} */
module.exports = (phase) => {
  // Only load bundle analyzer during development/build phases, never in production runtime
  const withBundleAnalyzer = 
    phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD
      ? require('@next/bundle-analyzer')({
          enabled: process.env.ANALYZE === 'true' || process.env.NEXT_BUILD_REPORT === '1',
        })
      : (config) => config;

  const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for LiveKit WebRTC adapter issues
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'webrtc-adapter': require.resolve('webrtc-adapter'),
      };
    }
    
    return config;
  },
  // Enable build report for CI
  experimental: {
    webpackBuildWorker: true,
  },
  // Generate build ID for tracking
  generateBuildId: async () => {
    return process.env.GITHUB_SHA || Date.now().toString()
  },
  };

  // Apply both plugins
  return withBundleAnalyzer(withNextPluginPreval(nextConfig));
};
