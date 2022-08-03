import App from 'next/app';
import { CartProvider } from '@nacelle/react-hooks';
import { nacelleClient } from 'services'
import Layout from '@/components/Layout';
import '../styles/global.scss';
import 'react-dropdown/style.css'

// The `AppContainer` overrides Next's default `App` component.
// (https://nextjs.org/docs/advanced-features/custom-app)

// The `AppContainer` utilizes `CartProvider` and `CheckoutProvider` from
// `@nacelle/react-hooks` in order to manage cart and checkout data.
// (https://github.com/getnacelle/nacelle-react/tree/main/packages/react-hooks)

// A Shopify Checkout client is created from `@nacelle/shopify-checkout`
// and passed to the `CheckoutProvider`.
// (https://github.com/getnacelle/nacelle-js/tree/main/packages/shopify-checkout)

const AppContainer = ({ Component, pageProps, headerSettings, footerSettings }) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(
    <CartProvider>
      <Layout headerSettings={headerSettings} footerSettings={footerSettings}>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  )

  // return (
  //   <CartProvider>
  //     <Layout headerSettings={headerSettings} footerSettings={footerSettings}>
  //       <Component {...pageProps} />
  //     </Layout>
  //   </CartProvider>
  // );
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
