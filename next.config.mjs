/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3050",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3060",
            },
            {
                protocol: "https",
                hostname: "connect.gcpaybuild.site",
            },
            {
                protocol: "https",
                hostname: "backend.tahweel.io",
            },
        ]
    },
    async rewrites() {
        return [
          {
            source: '/api/uploads/:path*',
            destination: 'http://localhost:3060/uploads/:path*',
          },
          {
            source: '/api/uploads/:path*',
            destination: 'https://connect.gcpaybuild.site/uploads/:path*',
          },
          {
            source: '/api/uploads/:path*',
            destination: 'https://backend.tahweel.io/uploads/:path*',
          },
        ];
    },
};

export default nextConfig;
