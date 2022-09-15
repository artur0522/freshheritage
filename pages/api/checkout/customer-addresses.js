import { withSentry } from "@sentry/nextjs";

const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);


function validateSavedAddress(address) {
  let errors = {};

  let expectedFields = ['street_1', 'city', 'province', 'zip', 'country']

  expectedFields.map(key => {
      if (isEmpty(address[key])) {
          errors[key] = `${key} field is required`;
      }
  })
  return {
      errors,
      isValid: isEmpty(errors)
  };
};

// export default async function handler(req, res) {
const handler = async (req, res) => {
  const { customerId } = JSON.parse(req.body)

  try {
    const customerResponse = await fetch(`https://api.boldcommerce.com/customers/v2/shops/${process.env.NEXT_PUBLIC_SHOP_IDENTIFIER}/customers/pid/${customerId}`, {
      headers: {
        Authorization: `Bearer ${process.env.BOLD_ACCESS_TOKEN}`,
      },
    });
    const customerJson = await customerResponse.json();
    const customer = customerJson.customer;

    let savedAddresses = []

    if (customer.addresses.length) {
      savedAddresses = customer.addresses.filter(address => validateSavedAddress(address).isValid).map((address) => {
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
    }

    res.status(200).json(savedAddresses)

  } catch (e) {
    // functions.logger.error("checkout",e)
    console.log(e)
    res.json({
      message: 'something went wrong',
      error: e
    })
  }
};

export default withSentry(handler);