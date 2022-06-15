export default async function handler(req, res) {
// app.get('/validate_inventory', async (req, res) => {
    const variants = req.query.variants

    try {
      const inventoryData = await fetch(`https://api.boldcommerce.com/products/v2/shops/${process.env.NEXT_PUBLIC_SHOP_IDENTIFIER}/variants?filter=in(platform_id:${variants})`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BOLD_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        return response.json()
      }).then(({ data, errors }) => {
        if (errors) throw new Error(errors)
        return data
      })

      const inventory = inventoryData.reduce((acc, curr) => (
        acc[curr.platform_id] = {
          product_id: curr.platform_product_id,
          quantity: curr.inventory_quantity,
          allow_backorder: curr.allow_backorder,
          inventory_tracker: curr.inventory_tracking_service,
          tracking_level: curr.inventory_tracking_entity,
          sku: curr.sku,
        }, acc), {}
      )
      res.send(inventory)
    } catch (e) {
      res.status(e.status || 500)
      res.send({
        message: e.message,
      })
    }
}