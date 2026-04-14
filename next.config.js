/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Set basePath to your repo name for GitHub Pages project repos
  basePath: '/vishu',
  assetPrefix: '/vishu/',
}

module.exports = nextConfig
