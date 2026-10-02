/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.referralbot.online" }],
        destination: "https://referralbot.online/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
