import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  typedRoutes: true,
  serverExternalPackages: [
    '@imgly/background-removal-node',
    'onnxruntime-node',
    'onnxruntime-common',
    'sharp',
  ],
  outputFileTracingIncludes: {
    '/api/admin/remove-background': [
      './node_modules/@imgly/background-removal-node/**/*',
      './node_modules/@imgly/background-removal-node/node_modules/**/*',
      './node_modules/onnxruntime-node/**/*',
      './node_modules/onnxruntime-common/**/*',
      './node_modules/sharp/**/*',
    ],
  },
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
