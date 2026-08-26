import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    clientSegmentCache: true,
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/content', 
        permanent: true,
      },
    ];
  },
};

export default nextConfig;