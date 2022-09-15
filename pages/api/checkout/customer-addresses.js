import { withSentry } from "@sentry/nextjs";

// export default async function handler(req, res) {
const handler = async (req, res) => {
  const { customerId } = JSON.parse(req.body)

  try {
    const customerResponse = await fetch(`https://api.boldcommerce.com/customers/v2/shops/${process.env.NEXT_PUBLIC_SHOP_IDENTIFIER}/customers/pid/${customerId}`, {
      headers: {
        Authorization: `Bearer ${process.env.BOLD_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const customerJson = await customerResponse.json();
    const customer = customerJson.customer;
    if (customer.addresses.length) {
      const savedAddresses = customer.addresses.map((address) => {
        return {
          id: address.id,
          first_name: address.first_name,
          last_name: address.last_name,
          address_line_1: address.street_1,
          address_line_2: address.street_2,
          province: address.province,
          city: address.city,
          country_code: address.country_iso2,
          country: address.country,
          province_code: address.province_code,
          postal_code: address.zip,
          business_name: address.company,
          phone_number: address.phone
        }
      })
      res.status(200).json(savedAddresses)
    }

    res.status(201).json([]);

  } catch (e) {
    // functions.logger.error("checkout",e)
    console.log(e)
    res.json({
      message: 'something went wrong',
      error: e
    })
  }

  res.send();
};

export default withSentry(handler);