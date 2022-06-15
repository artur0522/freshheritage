module.exports = {
  reactStrictMode: true,
  images: {
    // add image domains here as needed, for next/image
    domains: ['cdn.shopify.com', 'cdn.sanity.io'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  env: {
    checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_URLL || 'https://sitka-staging.vercel.app',
  },
}
