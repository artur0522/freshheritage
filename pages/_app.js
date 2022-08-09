import App from 'next/app'
import { CartProvider } from '@nacelle/react-hooks'
import { nacelleClient } from 'services'
import Layout from '@/components/Layout'
import '../styles/global.scss'
import 'react-dropdown/style.css'
import { useEffect, useState } from 'react'
import { Router, useRouter } from 'next/router'
import Script from 'next/script'
import { set } from 'es-cookie'

// The `AppContainer` overrides Next's default `App` component.
// (https://nextjs.org/docs/advanced-features/custom-app)

// The `AppContainer` utilizes `CartProvider` and `CheckoutProvider` from
// `@nacelle/react-hooks` in order to manage cart and checkout data.
// (https://github.com/getnacelle/nacelle-react/tree/main/packages/react-hooks)

// A Shopify Checkout client is created from `@nacelle/shopify-checkout`
// and passed to the `CheckoutProvider`.
// (https://github.com/getnacelle/nacelle-js/tree/main/packages/shopify-checkout)

const AppContainer = ({ Component, pageProps, headerSettings, footerSettings }) => {
  const router = useRouter()
  // const [mounted, setMounted] = useState(false)

  // useEffect(() => {
  //   if (mounted) document.getElementById('launcher').style.display = 'none'
  //   if (mounted) document.getElementById('launcher').style.display = 'none'

  // }, [mounted])

  useEffect(() => {
    const onRountChangeComplete = () => {
      // if(router.asPath === '/') {
      //   document.getElementById('launcher').style.display = 'none'
      // }

      if(router.asPath !== '/pages/how-it-works') {
        document.getElementById('launcher').style.display = 'none'
      } else {
        document.getElementById('launcher').style.display = 'initial'
      }
    }
    Router.events.on('routeChangeComplete', onRountChangeComplete)
  }, [router.asPath])

  return (
    <CartProvider>
      <Layout headerSettings={headerSettings} footerSettings={footerSettings}>
        <Component {...pageProps} />
      </Layout>


      
      {router.asPath !== '/' && <Script strategy="lazyOnload">
        {`
        window.zESettings = {
          analytics: false
        }`}
      </Script>}




      {router.asPath !== '/' && <Script
        id="ze-snippet" 
        src="https://static.zdassets.com/ekr/snippet.js?key=7926bf41-0910-4145-b2f7-44517d2707b0"
        strategy="lazyOnload"
      ></Script>}



    </CartProvider>
  );
}

AppContainer.getInitialProps = async (appContext) => {
  const contentEntry = await nacelleClient.content({
    handles: ['header-settings', 'footer-settings']
  })

  const headerSettings = contentEntry[0].fields
  const footerSettings = contentEntry[1].fields
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, headerSettings, footerSettings };
};

export default AppContainer;
