import { useCart, useCheckout } from '@nacelle/react-hooks';
import { useState, useEffect } from 'react';
import { nacelleClient } from 'services';

import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

// This component utilizes `useCart` and `useCheckout` hooks from
// `@nacelle/react-hooks` to clear cart and checkout data if the
// checkout is completed.
// https://github.com/getnacelle/nacelle-react/tree/main/packages/react-hooks

function Layout({ children }) {
  const [, { clearCart }] = useCart();
  const [{ completed }, { clearCheckoutData }] = useCheckout();

  const [headerSettings, setHeaderSettings] = useState(null);
  const [footerSettings, setFooterSettings] = useState(null);

  useEffect(async() => {
    const contentEntry = await nacelleClient.content({
      handles: ['header-settings', 'footer-settings']
    });
    console.log("contentEntry:", contentEntry)

    setHeaderSettings(contentEntry[0].fields)
    setFooterSettings(contentEntry[1].fields)
  }, [])

  useEffect(() => {
    if (completed) {
      clearCheckoutData();
      clearCart();
    }
  }, [completed, clearCheckoutData, clearCart]);

  return (
    <>
      <Header content={headerSettings} />
      <main>{children}</main>
      <Footer content={footerSettings} />
    </>
  );
}

export default Layout;
