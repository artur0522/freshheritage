import axios from 'axios'

export default async function handler(req, res) {

  console.log("api requested cid: ",req.query.cID)

  const config = {
    method: 'GET',
    url: `https://davis.sitkasalmonshares.com/subs?cId=`+req.query.cID,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.DAVIS_KEY,
      'origin': process.env.checkoutUrl,
    }
  };

  axios(config)
    .then((response) => {
      console.log(response.data);
      res.status(201).json({ message: 'success', data: response.data });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ message: 'error', data: error });
    });
}
