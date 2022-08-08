// const bodyParser = require('body-parser')
const crypto = require('crypto')
const util = require('util')

// body parser enabled by default in nextjs?
// https://nextjs.org/docs/api-routes/api-middlewares
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

export default async function handler(req, res) {
  // https://sitkasalmontest.ngrok.io/api/checkout/guest?product=39396153295034&qty=1

  // TEST PRODUCTS
  // 39396153295034 - octopus freezer                               https://sitkasalmontest.ngrok.io/initialize?product=39396153295034&qty=1
  //                                                                https://hcheckout-sandbox.sitkasalmonshares.com/initialize?product=39396153295034&qty=1
  // 39248899408058  - octopus sub - SG 5435, IID 49774             https://sitkasalmontest.ngrok.io/initialize?product=39248899408058&qty=1
  //                                                                https://hcheckout-sandbox.sitkasalmonshares.com/initialize?product=39248899408058&qty=1
  // 40341150564538 - seafood sub - SG 19362, IID 51911 (monthly)   https://sitkasalmontest.ngrok.io/initialize?product=40341150564538&qty=1
  //                                                                https://hcheckout-sandbox.sitkasalmonshares.com/initialize?product=40341150564538&qty=1

  // PROD PRODUCTS
  // 33044416200788 - King Salmon                                   https://hcheckout.sitkasalmonshares.com/initialize?product=33044416200788&qty=1

  // 299524 - Premium Seafood Subscription Box
  // Platform Product ID: 6631965360212
  // Variant 39454600331348 - Monthly / Shellfish                   https://hcheckout.sitkasalmonshares.com/initialize?product=39454600331348&qty=1
  // Variant 39454600364116 - Monthly / No Shellfish                https://hcheckout.sitkasalmonshares.com/initialize?product=39454600364116&qty=1

  // 299525 - Seafood Subscription Box
  // Platform Product ID: 6631965589588
  // Variant 39454600691796 - Monthly                               https://hcheckout.sitkasalmonshares.com/initialize?product=39454600691796&qty=1
  // Variant 39454602657876 - EOM                                   https://hcheckout.sitkasalmonshares.com/initialize?product=39454602657876&qty=1

  // 299526 - Salmon Subscription Box
  // Platform Product ID: 6631967031380
  // Variant 39454603706452 - EOM                                   https://hcheckout.sitkasalmonshares.com/initialize?product=39454603706452&qty=1

  // 20274 - Subscription Box Group ID
  // 51913 - Monthly
  // FREQ=MONTHLYINTERVAL=1WKST=MOBYMONTH=1,2,3,4,5,6,7,8,9,10,11,12
  // 51914 - EOM
  // FREQ=MONTHLYINTERVAL=2WKST=MOBYMONTH=1,2,3,4,5,6,7,8,9,10,11,12
  // 20467 - 6 Prepaids
  // 20468 - 12 Prepaids

  const bodyParsed = JSON.parse(req.body)

  const { products, customer, order_meta_data } = bodyParsed

  const body = {
    cart_items: [],
    // cart_items: [
    //   {
    //     "platform_id": "41593002361018",
    //     "quantity": 1,
    //     "line_item_key": "ae317f5e-755b-472c-9050-936870fe06f7"
    //   }
    // ],
    // order_meta_data: {
    //   "cart_parameters": {
    //       "bold_subscriptions": {
    //           "line_items_subscription_info": [
    //               {
    //                   "line_item_id": "ae317f5e-755b-472c-9050-936870fe06f7",
    //                   "variant_id": 41593002361018,
    //                   "quantity": 1,
    //                   "subscription_group_id": 19362,
    //                   "interval_id": 51911,
    //                   "interval_text": "Monthly",
    //                   "prepaid_selected": true,
    //                   "prepaid_duration_id": 20470
    //               }
    //           ]
    //       }
    //   },
    // }
  }

  if (customer) {
    body.customer = customer
  }

  if (order_meta_data) {
    body.order_meta_data = order_meta_data
  }

  if (products) {
    products.forEach((product) => {
      console.log("product:", product)
      body.cart_items.push({
        platform_id: product.platform_id,
        quantity: product.quantity,
        line_item_key: product.line_item_key,
        line_item_properties: product.line_item_properties
      })
    })
  }

  console.log('body:', util.inspect(body, false, null));

  // don't await result
  fetch(
    `${process.env.SITKA_GOOGLE_FUNCTION_BASE_URL}/checkout/keepAlive`,
    {
      headers: {
        'x-api-key': process.env.SITKA_GOOGLE_FUNCTION_KEY,
        'origin': 'pwa'
      },
      method: 'POST'
    }
  ).then(res => console.log('ship option cache response', res.statusText))
  .catch(e => console.log(e))

  try {
    // Initialize checkout
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/orders/${process.env.NEXT_PUBLIC_SHOP_IDENTIFIER}/init`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.BOLD_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )
    const responseJson = await response.json()
    console.log(responseJson)
    res.json(responseJson)
    // console.log(responseJson)
    // const checkoutData = responseJson.data
    // const publicOrderId = checkoutData.public_order_id

    // // Redirect to checkout page with the public order id
    // //   functions.logger.info("Bold checkout created public_order_id: " + publicOrderId)
    // console.log('Bold checkout created public_order_id: ' + publicOrderId)

    // disable old redirect from api to api
    // refactor to redirect to nextjs uncompiled client
    // res.redirect(`/api/checkout/begin?public_order_id=${publicOrderId}&cart_id=${cartId}`)
  } catch (e) {
    //   functions.logger.error("initialize",e)
    console.log(e)
    res.json({
      message: 'sometproductsng went wrong',
      error: e
    })
  }
}
