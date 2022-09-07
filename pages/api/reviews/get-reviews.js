/* /api/reviews */
import axios from 'axios'

export default async function handler(req, res) {

  const config = {
    method: 'GET',
    url: `https://stamped.io/api/v2/${process.env.NEXT_PUBLIC_STAMPEDIO_STORE_HASH}/dashboard/products`,
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: process.env.NEXT_PUBLIC_STAMPEDIO_KEY_PUBLIC,
      password: process.env.STAMPEDIO_API_KEY
    }
  };

  axios(config)
  .then((response) => {
    // console.log(response.data);
    res.status(201).json({ message: 'success', data: response.data });
  })
  .catch((err) => {
    // console.log(error);
    res.status(400).json({ message: 'error', data: err });
  });
}