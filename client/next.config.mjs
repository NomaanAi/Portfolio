/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ["10.145.70.60"],
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:5000/api/:path*",
            },
        ];
    },
};

export default nextConfig;
