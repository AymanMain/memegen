/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      // Configuration pour canvas
      '*.node': ['ignore-loader'],
    },
  },
  images: {
    domains: ['tnsetzwoaxcddbkstmng.supabase.co'],
  },
}

module.exports = nextConfig; 