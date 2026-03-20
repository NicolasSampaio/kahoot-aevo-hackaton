/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure all API routes are included in the build
  output: 'standalone',
};

module.exports = nextConfig;
