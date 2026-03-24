/** @type {import('next').NextConfig} */
const nextConfig = {
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
