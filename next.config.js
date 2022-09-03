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
    // process.env.NEXT_PUBLIC_CHECKOUT_URL needed for local testing with ngrok
    checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_URL || undefined,
  },
  async redirects() {

    const month = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
    const date = new Date()
    const monthName = month[date.getMonth()]
    const year = date.getFullYear()

    let theCatchUrl = `/the-catch/premium-seafood-box-${monthName}-${year}`

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
      {
        source: '/the-catch',
        destination: theCatchUrl,
        permanent: false,
      },
    ]
  }
}
