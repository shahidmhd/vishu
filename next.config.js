/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Set basePath to your repo name for GitHub Pages project repos
  // Comment these out for local dev, uncomment before pushing to GitHub
  ...(process.env.NODE_ENV === 'production' ? {
    basePath: '/vishu',
    assetPrefix: '/vishu/',
  } : {}),
}

module.exports = nextConfig
