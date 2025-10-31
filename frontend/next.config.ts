import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
    ignoreDuringBuilds: true,
  },
  // Workaround: some pdfjs-dist files try to require Node-only 'canvas' when bundling.
  // Provide a webpack fallback so the module resolution doesn't fail during build.
  webpack: (config, { isServer }) => {
    if (!config.resolve) config.resolve = {} as any;
    if (!config.resolve.fallback) config.resolve.fallback = {} as any;
    // Tell webpack that 'canvas' is not available in the browser bundle
    config.resolve.fallback = { ...(config.resolve.fallback || {}), canvas: false };
    return config;
  },

};

export default nextConfig;
