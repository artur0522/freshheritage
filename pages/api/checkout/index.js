export default async function handler(req, res) {
  const publicOrderId = req.query.public_order_id
  const cartId = req.query.cart_id

  try {
    console.log('checkout resumed')
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/orders/${process.env.NEXT_PUBLIC_SHOP_IDENTIFIER}/resume`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BOLD_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          public_order_id: publicOrderId
        })
      }
    )

    const responseJson = await response.json()
    console.log('bold response: ', responseJson)

    var checkout = responseJson.data
    checkout['initial_data']['cart_id'] = cartId
    // console.log("checkout passed to client: ",checkout)

    checkout.storeIdentifier = process.env.NEXT_PUBLIC_SHOP_IDENTIFIER
    res.status(200).json(JSON.stringify(checkout))

    // functions.logger.info("checkout app populated with publicOrderId: " + publicOrderId)
    console.log('checkout app populated with publicOrderId: ' + publicOrderId)
  } catch (e) {
    // functions.logger.error("checkout",e)
    console.log(e)
    res.json({
      message: 'something went wrong',
      error: e
    })
  }
}
