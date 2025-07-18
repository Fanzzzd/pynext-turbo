import './src/env.mjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@pynext-turbo/ui', '@pynext-turbo/api-client'],
};

export default nextConfig;
