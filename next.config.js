// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 600,
  images: {
    // add image domains here as needed, for next/image
    domains: ['cdn.shopify.com', 'cdn.sanity.io'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    // TODO: Remove this before releasing
    config.optimization.minimize = false;

    return config
  },
  env: {
    // process.env.NEXT_PUBLIC_CHECKOUT_URL needed for local testing with ngrok
    checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_URL || '',
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
};


const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
