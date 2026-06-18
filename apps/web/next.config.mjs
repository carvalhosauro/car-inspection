/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@vistoria/contracts", "@vistoria/api-client"],
  experimental: { typedRoutes: true },
};

export default nextConfig;
