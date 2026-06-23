/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@vistoria/contracts", "@vistoria/api-client", "@vistoria/ui"],
  typedRoutes: true,
};

export default nextConfig;
