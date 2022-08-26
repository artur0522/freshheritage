/* /api/klaviyo */
export default async function handler(req, res) {
import { withSentry } from "@sentry/nextjs";

  /*
    sample data
    {
      "$email": "ben.franklin@klaviyo.com"
      'Entered Drawing - ${klaviyoListId}': true
    }
  */

const handler = async (req, res) => {

  const options = {
    method: 'POST',
    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({
      token: process.env.NEXT_PUBLIC_KLAVIYO_API_KEY,
      properties: req.body
    })
  }

  fetch('https://a.klaviyo.com/api/identify', options)
    .then(response => response.json())
    .then(response => {
      if (response == '0') {
        res.status(400).json({ message: 'error', data: response })
      }
      res.status(201).json({ message: 'success', data: response })
    })
    .catch(err => {
      res.status(400).json({ message: 'error', data: err })
    })

};

export default withSentry(handler);