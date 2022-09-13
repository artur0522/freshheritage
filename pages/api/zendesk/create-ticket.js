/* /api/zendesk */
import axios from 'axios'
import { withSentry } from "@sentry/nextjs";

// export default async function handler(req, res) {
const handler = async (req, res) => {

  const { subject, message, email, first_name, last_name, phone_number } = JSON.parse(req.body)

  const body = {
    "ticket": {
      "subject": subject,
      "comment": {
        "body": message
      },
      "recipient": email,
      "custom_fields" : [
        {
          "first_name": first_name,
          "last_name": last_name,
          "phone_number": phone_number
        }
      ]
    }
  }

  axios.post('https://sitkasalmonshareshelp.zendesk.com/api/v2/tickets.json', JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json'
    },
    auth: {
      'username': 'joe@sitkasalmonshares.com/token',
      'password': process.env.NEXT_PUBLIC_ZENDESK_TOKEN
    }
  })
  .then((response) => {
    res.status(201).json({ message: 'success', data: response.data });
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json({ message: 'error', data: err });
  });

};

export default withSentry(handler);