/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Disable SWC wasm minifier (mishandles template-literal backticks in radix deps)
  swcMinify: false,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'react',
        'react-dom': 'react-dom',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
