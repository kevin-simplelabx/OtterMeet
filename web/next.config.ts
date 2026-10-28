import path from 'node:path';
import type { NextConfig } from 'next';

// The Rails API runs on :3001 (in WSL). Proxying /api keeps the host's login cookie first-party.
const API_ORIGIN = process.env.API_ORIGIN ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_ORIGIN}/api/:path*` }];
  },
};

export default nextConfig;
