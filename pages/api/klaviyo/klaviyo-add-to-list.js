/* /api/klaviyo */

export default async function handler(req, res) {

  const options = {
    method: 'POST',
    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({
      profiles: [
        {
          email: req.body.email,
        }
      ]
    })
  };

  fetch(`https://a.klaviyo.com/api/v2/list/${req.body.list_id}/members?api_key=${process.env.NEXT_KLAVIYO_API_KEY}`, options)
    .then(response => response.json())
    .then(response => {
      if (response.hasOwnProperty('detail')) {
        res.status(400).json({ message: 'error', data: response });
      }
      res.status(201).json({ message: 'success', data: response });
    })
    .catch(err => {
      console.error(err)
      res.status(400).json({ message: 'error', data: err });
    });

}