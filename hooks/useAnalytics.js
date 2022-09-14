export function isGaEnabled(){
  return typeof window.gtag === 'function';
}

const useAnalytics = () => {
  const trackEvent = (eventType,eventObj,eventName) => {
    if (isGaEnabled()) {
      let category = '';
      switch(eventType) {

        case 'view_item_list':
          console.log('view_item_list',eventObj,eventName);
          let item_list = eventObj.map(item => {
            return {
              item_id: item.sourceEntryId.replace('gid://shopify/Product/', ''),
              item_name: item.content.title
            }
          })
          window.gtag('event', 'view_item_list', {
            'item_list_name': eventName,
            'items': item_list
            });
          break


        case 'view_product':
          console.log('view_product',eventObj);
          window.gtag('event', 'view_item', {
            'currency': 'USD',
            'value': eventObj.variants[0].price,
            'items': [ {
              'item_id': eventObj.sourceEntryId.replace('gid://shopify/Product/', ''),
              'item_name': eventObj.content.title
              } ]
            });
          
          break

        case 'add_to_cart':
          console.log('checkout add_to_cart',eventObj);

          if (eventObj.product.tags.includes('Subscription Box')) {
            category = 'Subscription Box';
          } else if (eventObj.product.tags.includes('freezer')) {
            category = 'freezer';
          } else {
            category = '';
          }

          window.gtag('event', 'add_to_cart', {
            'currency': 'USD',
            'value': eventObj.variant.price,
            'items': [ {
              'item_id': eventObj.product.sourceEntryId.replace('gid://shopify/Product/', ''),
              'item_name': eventObj.variant.productTitle,
              'item_variant': eventObj.variant.title,
              'quantity': eventObj.quantity,
              'price': eventObj.variant.price,
              'currency': 'USD',
              'item_category': category
              } ]
            });
          break


        case 'remove_from_cart':
          console.log('checkout remove_from_cart',eventObj);

          if (eventObj.product_data.tags.includes('Subscription Box')) {
            category = 'Subscription Box';
          } else if (eventObj.product_data.tags.includes('freezer')) {
            category = 'freezer';
          }

          window.gtag('event', 'remove_from_cart', {
            'currency': 'USD',
            'value': eventObj.product_data.price / 100,
            'items': [ {
              'item_id': eventObj.product_data.product_id,
              'item_name': eventObj.product_data.product_title,
              'item_variant': eventObj.product_data.title,
              'quantity': eventObj.product_data.quantity,
              'price': eventObj.product_data.price / 100,
              'currency': 'USD',
              'item_category': category
              } ]
            });
          break
    

        case 'landing_page':
          // cart=checkout architecture choice means this is essentially our cart
          console.log('checkout landing_page',eventObj);
          if (eventObj.line_items.length > 0) {
            let lineItems = eventObj.line_items.map(item => {

              const line_item = item.product_data
              if (line_item.tags.includes('Subscription Box')) {
                category = 'Subscription Box';
              } else if (line_item.tags.includes('freezer')) {
                category = 'freezer';
              } else {
                category = '';
              }

              return {
                item_id: line_item.product_id,
                item_name: line_item.product_title,
                item_variant: line_item.title,
                quantity: line_item.quantity,
                price: line_item.price / 100,
                currency: 'USD',
                item_category: category
              }
            })
            // console.log('checkout landing_page line items',lineItems);
            window.gtag('event', 'view_cart', {
              'currency': 'USD',
              'value': eventObj.order_total / 100,
              'items': lineItems
              });
          }
          break


        case 'set_customer':
          // is called immidiately on login
          // also called when guest email is input
          // not called when already loged in..
          // console.log("checkout set_customer");

          break


        case 'set_shipping_address':
          // console.log("checkout set_shipping_address");
          break


        case 'set_billing_address':
          // console.log("checkout set_billing_address");
          break


        case 'apply_discount_code':
          // console.log("checkout apply_discount_code");
          break


        case 'remove_discount_code':
          // console.log("checkout remove_discount_code");
          break


        case 'set_shipping_line':
          // console.log("checkout set_shipping_line");
          break


        case 'click_complete_order':
          // console.log('checkout click_complete_order');

          break


        case 'checkout_complete':
          console.log('checkout checkout_complete',eventObj);
          let lineItems = eventObj.line_items.map(item => {

            const line_item = item.product_data
            if (line_item.tags.includes('Subscription Box')) {
              category = 'Subscription Box';
            } else if (line_item.tags.includes('freezer')) {
              category = 'freezer';
            } else {
              category = '';
            }

            return {
              item_id: line_item.product_id,
              item_name: line_item.product_title,
              item_variant: line_item.title,
              quantity: line_item.quantity,
              price: line_item.price / 100,
              currency: 'USD',
              item_category: category
            }
          })

          const hasSub =
            eventObj.line_items.filter((item) => {
              return item.product_data.tags.includes('Subscription Box');
            }).length > 0;
          const hasFb =
            eventObj.line_items.filter((item) => {
              return item.product_data.tags.includes('freezer');
            }).length > 0;

          let event_purchase_cateogry = 'purchase';
          if (hasSub && hasFb){
            event_purchase_cateogry = 'mixed_purchase'
          } else if (hasSub){
            event_purchase_cateogry = 'sub_purchase'
          } else if (hasFb){
            event_purchase_cateogry = 'otp_purchase'
          }

          window.gtag('event', event_purchase_cateogry, {
            'transaction_id': eventObj.publicOrderId,
            'currency': 'USD',
            'value': eventObj.order_total / 100,
            'items': lineItems
            });
          break


        case 'thank_you':
          // console.log("checkout thank_you",eventObj);
          break


        case 'login':
          console.log('login event',eventObj);
          //currently returns with an empty response
          //TODO: find bug
          window.gtag('event', 'login', {
            'method': 'modal'
            });
          window.gtag('set', 'user_properties', {
            'customer_id': '777',
            'membership_tier': 'test_tier'
            });
          break



        default:
      }
    } else {
      //TODO: throw sentry error
    }
  }
  return trackEvent
}

export default useAnalytics
