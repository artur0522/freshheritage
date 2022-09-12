import App from 'next/app'
import { CartProvider } from '@nacelle/react-hooks'
import { nacelleClient } from 'services'
import Layout from '@/components/Layout'
import '../styles/global.scss'
import 'react-dropdown/style.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'
import TagManager from 'react-gtm-module'
import { dataLayerRouteChange } from '@/utils/dataLayer'
import { set } from 'es-cookie'

// The `AppContainer` overrides Next's default `App` component.
// (https://nextjs.org/docs/advanced-features/custom-app)

// The `AppContainer` utilizes `CartProvider` and `CheckoutProvider` from
// `@nacelle/react-hooks` in order to manage cart and checkout data.
// (https://github.com/getnacelle/nacelle-react/tree/main/packages/react-hooks)

// A Shopify Checkout client is created from `@nacelle/shopify-checkout`
// and passed to the `CheckoutProvider`.
// (https://github.com/getnacelle/nacelle-js/tree/main/packages/shopify-checkout)

const AppContainer = ({ Component, pageProps, headerSettings, footerSettings, searchLinks }) => {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const pagesToDisplayChatWidget = [
    '/collections/',
    '/products/',
    '/pages/how-it-works',
    '/pages/choose-your-plan',
    '/pages/customize-your-plan',
    '/pages/intro-box',
    '/pages/contact-us',
    '/checkout',
  ]

  const displayZendeskWidget = (newUrl = router.asPath) => {
    if (document.getElementById('launcher')) {
      if (pagesToDisplayChatWidget.some(pageUrl => newUrl.indexOf(pageUrl) > -1)) {
        document.getElementById('launcher').style.display = 'block'
      } else {
        document.getElementById('launcher').style.display = 'none'
      }
    }
  }

  const onRountChangeComplete = (newUrl) => {
    displayZendeskWidget(newUrl)
    if (window && window.StampedFn) {
      StampedFn.init()
    }
    if (TagManager) {
      dataLayerRouteChange({ url: router.asPath })
    }
  }

  useEffect(() => {
    setMounted(true)
    TagManager.initialize({
      gtmId: process.env.NEXT_PUBLIC_GA_TRACKING_ID
    })
    onRountChangeComplete()
    router.events.on('routeChangeComplete', onRountChangeComplete)
  }, [])

  useEffect(() => {
    displayZendeskWidget()
  }, [router.asPath])

  return (
    <CartProvider>
      <Layout headerSettings={headerSettings} footerSettings={footerSettings} searchLinks={searchLinks}>
        <Component {...pageProps} />
      </Layout>

      {mounted &&
        <Script
          data-api-key={process.env.NEXT_PUBLIC_STAMPEDIO_KEY_PUBLIC}
          id="stamped-script-widget"
          src="https://cdn1.stamped.io/files/widget.min.js"
          onLoad={() => {
            StampedFn.init({ apiKey: process.env.NEXT_PUBLIC_STAMPEDIO_KEY_PUBLIC, storeUrl: process.env.NEXT_PUBLIC_STAMPEDIO_STORE_HASH });
          }}
        />
      }

      {mounted && <Script id="ze-settings" strategy="afterInteractive">
        {`
        window.zESettings = {
          analytics: false
        }`}
      </Script>}

      {mounted ? <Script
        id="ze-snippet"
        src={`https://static.zdassets.com/ekr/snippet.js?key=${process.env.NEXT_PUBLIC_ZENDESK_KEY}`}
        strategy="afterInteractive"
        onLoad={() => {
          setTimeout(() => {
            displayZendeskWidget()
          }, 5000)
        }}
      ></Script> : null}
    </CartProvider>
  )
}

AppContainer.getInitialProps = async (appContext) => {
  const contentEntry = await nacelleClient.content({
    handles: ['header-settings', 'footer-settings', 'search-recommended-links']
  })

  const headerSettings = contentEntry[0]?.fields
  const footerSettings = contentEntry[1]?.fields
  const searchLinks = contentEntry[2]?.fields

  const appProps = await App.getInitialProps(appContext)

  return { ...appProps, headerSettings, footerSettings, searchLinks }
};

export default AppContainer;
