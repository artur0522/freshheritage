import { ArticleProvider } from '@/context/ArticleContext'
import { ArticleFiltersDrawerProvider } from '@/context/ArticleFiltersDrawerContext'
import { ModalProvider } from '@/context/ModalContext'
import { PDPDrawerProvider } from '@/context/PDPDrawerContext'
import { CustomerProvider } from '@/context/CustomerContext'
import { PurchaseFlowProvider } from '@/context/PurchaseFlowContext'
import { HeadlessCheckoutProvider } from '@/context/HeadlessCheckoutContext';
import { HeaderProvider } from '@/context/HeaderContext';

import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

// This component utilizes `useCart` and `useCheckout` hooks from
// `@nacelle/react-hooks` to clear cart and checkout data if the
// checkout is completed.
// https://github.com/getnacelle/nacelle-react/tree/main/packages/react-hooks

function Layout({ children, headerSettings, footerSettings }) {

  return (
    <CustomerProvider>
      <HeadlessCheckoutProvider pageHandle={children.props.handle}>
        <PurchaseFlowProvider>
          <PDPDrawerProvider>
            <ArticleFiltersDrawerProvider>
            <ModalProvider>
              <ArticleProvider>
                <HeaderProvider content={headerSettings} pageHandle={children.props.handle} >
                  <main>{children}</main>
                  <Footer content={footerSettings} />
                </HeaderProvider>
              </ArticleProvider>
            </ModalProvider>
            </ArticleFiltersDrawerProvider>
          </PDPDrawerProvider>
        </PurchaseFlowProvider>
      </HeadlessCheckoutProvider>
    </CustomerProvider>
  )
}

export default Layout
