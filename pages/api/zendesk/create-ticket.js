/* /api/zendesk */
import zendesk from 'node-zendesk'

const client = zendesk.createClient({
  username:  '',
  token:     process.env.NEXT_PUBLIC_ZENDESK_TOKEN,
  remoteUri: 'https://add subdomain here.zendesk.com/api/v2'
});

export default async function handler(req, res) {

  const { subject, message, email } = req.body

  const ticket = {
    "subject": subject,
    "comment": {
      "body": message
    },
    "recipient": email
  }

  client.ticket.create(ticket)
    .then((response) => {
      console.log(response);
      res.status(201).json({ message: 'success' });
    })
    .catch((err) => {
      // console.log(error);
      res.status(400).json({ message: 'error', data: err });
    });
}