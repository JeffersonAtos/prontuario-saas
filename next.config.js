/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['supabase.co'], // permite carregar logos das clínicas
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
