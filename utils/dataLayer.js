import TagManager from 'react-gtm-module'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'
import { formatPrice } from './formatPrice';

function buildProductData(products, type, url) {
  return products.map((product, index) => {
    const firstVariant = product.variants[0]
    const data = {
      id: firstVariant.sku, // SKU
      name: product.content.title, // Product title
      brand: "Sitka Salmon Shares",
      category: "",
      variant: firstVariant.content.title,
      price: firstVariant.price.toString(),
      quantity: "1",
      product_id: product.sourceEntryId.replace('gid://shopify/Product/', ''), // The product_id
      variant_id: firstVariant.sourceEntryId.replace('gid://shopify/ProductVariant/', ''), // id or variant_id
      compare_at_price: firstVariant?.compareAtPrice?.toString() || '', // If available on dl_view_item & dl_add_to_cart otherwise use an empty string
      image: firstVariant.content.featuredMedia?.src || '', // If available, otherwise use an empty string
    }

    if (type === 'collection') {
      data['list'] = url // The list the product was discovered from or is displayed in
      data['position'] = index.toString() // position in the list of search results, collection views and position in cart indexed starting at 1
    }

    return data
  })
}

function buildProductDataFromBold(lineItems) {
  return lineItems.map((item) => {
    item = item.product_data
    return {
      id: item.sku, // SKU
      name: item.product_title, // Product title
      brand: "Sitka Salmon Shares",
      category: "",
      variant: item.title,
      price: formatPrice(item.price).toString(),
      quantity: item.quantity.toString(),
      product_id: item.product_id, // The product_id
      variant_id: item.variant_id, // id or variant_id
      compare_at_price: item.compare_at_price ? formatPrice(item.compare_at_price).toString() : '', // If available on dl_view_item & dl_add_to_cart otherwise use an empty string
      image: item.image_url || '', // If available, otherwise use an empty string
    }
  })
}

/*
  item must be unique custom object from HeadlessCheckoutContext.js
*/
export const dataLayerATC = ({ item }) => {
  TagManager.dataLayer({ dataLayer: {
    event: 'dl_add_to_cart',
    event_time: moment().format('YYYY-MM-DD HH:mm:ss'), // Timestamp for the event
    ecommerce: {
      add: {
        products: [{
          id: item.variant.sku, // SKU
          name: item.variant.productTitle, // Product title
          brand: "Sitka Salmon Shares",
          category: "",
          variant: item.variant.title,
          price: item.variant.price.toString(),
          quantity: "1",
          product_id: item.product.sourceEntryId.replace('gid://shopify/Product/', ''), // The product_id
          variant_id: item.variantId.toString(), // id or variant_id
          compare_at_price: item.variant?.compareAtPrice?.toString() || '', // If available on dl_view_item & dl_add_to_cart otherwise use an empty string
          image: item.variant.featuredMedia?.src || '', // If available, otherwise use an empty string
        }]
      }
    }
  }})
}

/*
  item must be unique custom object from HeadlessCheckoutContext.js
  - this is for removing from cart
*/
export const dataLayerRFC = ({ item }) => {
  TagManager.dataLayer({ dataLayer: {
    event: 'dl_remove_from_cart',
    event_time: moment().format('YYYY-MM-DD HH:mm:ss'), // Timestamp for the event
    ecommerce: {
      remove: {
        products: buildProductDataFromBold([item])
      }
    }
  }})
}

export const dataLayerViewProductList = ({products, url}) => {
  TagManager.dataLayer({ dataLayer: {
    event: 'dl_view_item_list',
    // user_properties: user_properties,
    event_time: moment().format('YYYY-MM-DD HH:mm:ss'), // Timestamp for the event
    ecommerce: {
      impressions: buildProductData([...products], 'collection', url)
    }
  }})
}

export const dataLayerViewSearchResults = ({products}) => {
  const uniqueKey = uuidv4()
  TagManager.dataLayer({ dataLayer: {
    event: 'dl_view_search_results',
    // user_properties: user_properties,
    event_id: uniqueKey.toString(), // unique uuid for FB conversion API
    event_time: moment().format('YYYY-MM-DD HH:mm:ss'), // Timestamp for the event
    ecommerce: {
      actionField: { list: 'search results' },
      impressions: products.map((item, index) => {
        return {
          id: item.sku, // SKU
          name: item.title, // Product title
          brand: "Sitka Salmon Shares",
          category: "",
          variant: item.variant_title,
          price: formatPrice(item.price).toString(),
          quantity: "1",
          product_id: item.id.toString(), // The product_id
          variant_id: "", // id or variant_id
          compare_at_price: item.compare_at_price ? formatPrice(item.compare_at_price).toString() : '', // If available on dl_view_item & dl_add_to_cart otherwise use an empty string
          image: item.image || '', // If available, otherwise use an empty string
          position: index.toString()
        }
      })
    }
  }})
}

/*
  Use this for selecting products from collections/search results
*/
export const dataLayerSelectProduct = ({product, url}) => {
  const uniqueKey = uuidv4()
  TagManager.dataLayer({ dataLayer: {
    event: 'dl_select_item',
    // user_properties: user_properties,
    event_id: uniqueKey.toString(), // unique uuid for FB conversion API
    event_time: moment().format('YYYY-MM-DD HH:mm:ss'), // Timestamp for the event
    ecommerce: {
      click: {
        actionField: {'list': url, 'action': 'click'}, // this should be the collection page URL
        products: buildProductData([product])
      }
    }
  }})
}

export const dataLayerViewCart = ({ cart }) => {
  if (!cart.line_items.length) {
    return false
  }
  TagManager.dataLayer({ dataLayer: {
    event: 'dl_view_cart',
    // user_properties: user_properties,
    event_time: moment().format('YYYY-MM-DD HH:mm:ss'), // Timestamp for the event
    cart_total: formatPrice(cart.order_total).toString(),
    ecommerce: {
      "actionField": { "list": "Shopping Cart" },
      impressions: buildProductDataFromBold(cart.line_items)
    }
  }})
}

/*
  When does this get fired if checkout is the flyout?
*/
export const dataLayerBeginCheckout = ({ cart }) => {

}

export const dataLayerSignup = ({ customer, url }) => {
  TagManager.dataLayer({ dataLayer: {
    "event": "dl_sign_up",
    "page": {
      url: url
    },
    event_time: moment().format('YYYY-MM-DD HH:mm:ss'), // Timestamp for the event
  }})
}

export const dataLayerLogin = ({ customer, url }) => {
  TagManager.dataLayer({ dataLayer: {
    "event": "dl_login",
    "page": {
      url: url
    },
    event_time: moment().format('YYYY-MM-DD HH:mm:ss'), // Timestamp for the event
  }})
}

export const dataLayerViewProduct = ({product}) => {
  const uniqueKey = uuidv4()
  TagManager.dataLayer({ dataLayer: {
    event: 'dl_view_item',
    // user_properties: user_properties,
    event_id: uniqueKey.toString(), // unique uuid for FB conversion API
    event_time: moment().format('YYYY-MM-DD HH:mm:ss'), // Timestamp for the event
    ecommerce: {
      detail: {
        products: buildProductData([product])
      }
    }
  }})
}

export const dataLayerRouteChange = ({ url }) => {
  TagManager.dataLayer({ dataLayer: {
    event: 'dl_route_change',
    url: url
  }})
}