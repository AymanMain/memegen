/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      // Configuration pour canvas
      '*.node': ['ignore-loader'],
    },
  },
  images: {
    domains: [
      'i.imgur.com',  // Imgur image URLs
      'imgur.com',    // Imgur website
    ],
  },
}

module.exports = nextConfig; 