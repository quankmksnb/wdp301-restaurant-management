/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // pathname: '/<your-cloud-name>/**',
      },
    ],
  },
};

export default nextConfig;
