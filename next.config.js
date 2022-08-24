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
    checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_URL || 'https://sitka-staging.vercel.app',
  },
  async redirects() {
    return [
      {
        source: '/account',
        destination: '/account/subscriptions',
        permanent: true,
      },
      {
        source: '/products/premium-seafood-subscription-box',
        destination: '/pages/choose-your-plan',
        permanent: false,
      },
      {
        source: '/products/salmon-subscription-box',
        destination: '/pages/choose-your-plan',
        permanent: false,
      },
      {
        source: '/products/seafood-subscription-box',
        destination: '/pages/choose-your-plan',
        permanent: false,
      },
      {
        source: '/products/sitka-seafood-intro-box',
        destination: '/pages/choose-your-plan',
        permanent: false,
      },
    ]
  }
}
