/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "imgs.search.brave.com",
      },
      {
        hostname: "files.edgestore.dev",
      },
    ],
  },
};

module.exports = nextConfig;
