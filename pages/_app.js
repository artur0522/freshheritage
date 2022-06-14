import { CartProvider } from '@nacelle/react-hooks';
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

function AppContainer({ Component, pageProps }) {


  return (
    <CartProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}

export default AppContainer;
