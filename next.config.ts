import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  typedRoutes: true,
  serverExternalPackages: [
    '@imgly/background-removal-node',
    'onnxruntime-node',
    'sharp',
  ],
  async rewrites() {
    return [
      {
        source: '/uploads/products/:filename',
        destination: '/api/media/products/:filename',
      },
    ];
  },
};

export default nextConfig;
