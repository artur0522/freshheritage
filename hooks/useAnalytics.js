// import ReactGA from "react-ga"
// ReactGA.initialize(process.env.GA_PROPERTY)


const useAnalytics = () => {
  const trackEvent = (eventType) => {
    switch(eventType) {
      case 'landing_page':
      //   ReactGA.pageview('/checkout')
      //   ReactGA.event({
      //     category: 'hCheckout',
      //     action: 'Checkout Initiated'
      //   })
        break
      case 'set_customer':
        // Customer events
        break
      case 'set_shipping_address':
        // Complete shipping address events
        break
      case 'set_billing_address':
        // Complete shipping address events
        break
      case 'apply_discount_code':
        // Apply discount code events
        break
      case 'remove_discount_code':
        // Remove discount code events
        break
      case 'set_shipping_line':
        // Selected shipping line events
        break
      case 'click_complete_order':
        // ReactGA.event({
        //   category: 'hCheckout',
        //   action: 'Order Completed'
        // })
        break
      case 'thank_you':
        // ReactGA.pageview('/order_confirmation')
        // console.log("thank you / confirmation page? ")
        // Thank you page events
        break
      default:
    }
  }

  return trackEvent
}

export default useAnalytics
