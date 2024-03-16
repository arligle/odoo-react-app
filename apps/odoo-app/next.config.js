/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
  async rewrites() {
    return [
      {
        source: "/gateway/:path*",
        destination: "http://localhost:9999/:path*", // Proxy to Backend
      },
    ];
  },
};
