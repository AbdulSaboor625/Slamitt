/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://about.slamitt.com/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
