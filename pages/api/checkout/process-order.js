export default async function handler(req, res) {
  const { publicOrderId, jwt } = JSON.parse(req.body)
  try {
    console.log('process order with id', publicOrderId)
    const response = await fetch(
      `https://api.boldcommerce.com/checkout/storefront/${process.env.SHOP_IDENTIFIER}/${publicOrderId}/process_order`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )

    const responseJson = await response.json()
    console.log('bold response order processed: ', responseJson)

    const responseData = responseJson.data
    // console.log("checkout passed to client: ",checkout)

    res.status(200).json(responseData)

    // functions.logger.info("checkout app populated with publicOrderId: " + publicOrderId)
  } catch (e) {
    // functions.logger.error("checkout",e)
    console.log(e)
    res.json({
      message: 'something went wrong',
      error: e
    })
  }
}
