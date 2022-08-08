export default async function handler(req, res) {
  const { zip, bundledShipWeek } = req.body;

  try {
    const response = await fetch(
      `${process.env.SITKA_GOOGLE_FUNCTION_BASE_URL}/checkout/shippingOptions`,
      {
        headers: {
          'x-api-key': process.env.SITKA_GOOGLE_FUNCTION_KEY,
          'origin': 'pwa',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          zip: zip,
          bundledShipWeek: bundledShipWeek
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('ship options returned: ', data);
      res.status(200).json(data);
    } else {
      res.status(500);
    }
  } catch (e) {
    console.log(e)
    res.json({
      message: 'something went wrong',
      error: e
    })
  }
  res.send();
}
