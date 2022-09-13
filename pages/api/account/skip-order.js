
export default async function handler(req, res) {
  const url = 'https://davis.sitkasalmonshares.com/skip_order';
  const config = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.DAVIS_KEY,
      // 'origin': 'pwa'
    },
    body: req.body,
  };

  fetch(url, config)
  .then((response) => {
    console.log(response.data);
    res.status(200).json({ message: 'success', data: response.data });
  })
  .catch((error) => {
    console.log(error);
    res.status(400).json({ message: 'error', data: error });
  });
}
