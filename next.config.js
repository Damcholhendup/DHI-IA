/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/drukair/:path*',
        destination: 'http://100.85.189.71:8000/drukair/:path*',
      },
      {
        source: '/api/bhutan_telecom/:path*',
        destination: 'http://100.85.189.71:8000/bhutan_telecom/:path*',
      },
      {
        source: '/api/chat/:path*',
        destination: 'http://100.85.189.71:8001/chat/:path*',
      },
    ]
  },
}

module.exports = nextConfig
