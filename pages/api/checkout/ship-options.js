export default async function handler(req, res) {
  const { zip, bundledShipWeek } = req.body;

  try {
    const result = await fetch(
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

    if (result.ok) {
      const data = await result.json();
      res.status(200).json(data);
    } else {
      res.status(500);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'something went wrong',
      error: e
    });
  }
  res.send();
}
