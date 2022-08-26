/* /api/klaviyo */
export default async function handler(req, res) {
import { withSentry } from "@sentry/nextjs";

// const { email, list_id } = JSON.parse(req.body)
const handler = async (req, res) => {

  const options = {
    method: 'POST',
    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({
      profiles: [
        {
          email: email,
        }
      ]
    })
  };

  fetch(`https://a.klaviyo.com/api/v2/list/${list_id}/members?api_key=${process.env.NEXT_PUBLIC_KLAVIYO_API_KEY}`, options)
    .then(response => response.json())
    .then(response => {
      console.log(response)
      if (response.hasOwnProperty('detail')) {
        res.status(400).json({ message: 'error', data: response });
      }
      res.status(201).json({ message: 'success', data: response });
    })
    .catch(err => {
      console.error(err)
      res.status(400).json({ message: 'error', data: err });
    });

};

export default withSentry(handler);