// /api/product/available

import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'

export default async function handler(req, res) {
  const {query: { productHandle }} = req
  const { products } = await nacelleClient.query({
    query: GET_PRODUCTS,
    variables: {
      "filter": {
        "handles": [productHandle]
      }
    }
  })
  res.json(products[0]);
}