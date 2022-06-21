// app.post('/cart/clear', async (req, res) => {
export default async function handler(req, res) {
  const cartToken = req.body.cart_token
  // functions.logger.info("clear shopify cart: " + cartToken)
  console.log('clear shopify cart: ' + cartToken)
  // functions.logger.info("server: " + process.env.NEXT_PUBLIC_MYSHOPIFY_DOMAIN)
  console.log('server: ' + process.env.NEXT_PUBLIC_MYSHOPIFY_DOMAIN)

  try {
    let data = await fetch(
      `https://${process.env.NEXT_PUBLIC_MYSHOPIFY_DOMAIN}/cart/clear.json`,
      {
        method: 'POST',
        headers: {
          Cookie: `cart=${cartToken}`,
        },
      },
    )
      .then((response) => {
        return response.text()
      })
      .then((data) => {
        return data
      })

    res.send(data)
  } catch (e) {
    //   functions.logger.error("cart/clear", e)
    console.log(e)
    res.json({
      message: 'something went wrong',
      error: e,
    })
  }
}
