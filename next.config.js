const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Moved from experimental in Next.js 15+
  serverExternalPackages: ['mongodb'],
  experimental: {
    // Other experimental features can go here
  },
  // Removed webpack config to avoid conflicts with Turbopack (enabled by default in Next.js 16)
  /*
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 300,
        ignored: ['** /node_modules'],
      };
    }
    return config;
  },
  */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGINS || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
