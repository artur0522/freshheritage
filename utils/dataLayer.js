import TagManager from 'react-gtm-module'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'

/*
  item must be unique custom object from HeadlessCheckoutContext.js
*/
export const dataLayerATC = ({ item }) => {
  TagManager.dataLayer({ dataLayer: {
    event: 'dl_add_to_cart',
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
export const dataLayerRFC = ({}) => {

}

/*
  Use this for selecting products from collections/search results
*/
export const dataLayerSelectProduct = ({product, url}) => {
  const firstVariant = product.variants[0]
  const uniqueKey = uuidv4()
  TagManager.dataLayer({ dataLayer: {
    event: 'dl_select_item',
    // user_properties: user_properties,
    event_id: uniqueKey.toString(), // unique uuid for FB conversion API
    event_time: moment().format('YYYY-MM-DD HH:mm:ss'), // Timestamp for the event
    ecommerce: {
      click: {
        actionField: {'list': url, 'action': 'click'}, // this should be the collection page URL
        products: [{
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
        }]
      }
    }
  }})
}

export const dataLayerViewCart = ({ cart }) => {

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
  const firstVariant = product.variants[0]
  const uniqueKey = uuidv4()
  TagManager.dataLayer({ dataLayer: {
    event: 'dl_view_item',
    // user_properties: user_properties,
    event_id: uniqueKey.toString(), // unique uuid for FB conversion API
    event_time: moment().format('YYYY-MM-DD HH:mm:ss'), // Timestamp for the event
    ecommerce: {
      detail: {
        products: [{
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
        }]
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