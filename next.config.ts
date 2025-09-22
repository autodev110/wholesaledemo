import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // ✅ This ignores linting errors during `next build`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
