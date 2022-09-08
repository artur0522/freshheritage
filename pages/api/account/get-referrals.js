import axios from 'axios'

export default async function handler(req, res) {

  console.log("api requested referral data for cid: ",req.query.cID)

  const config = {
    method: 'GET',
    url: `https://davis.sitkasalmonshares.com/getReferrals?cID=`+req.query.cID,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.DAVIS_KEY,
      'origin': 'pwa',
    }
  };

  axios(config)
  .then((response) => {
    console.log('Referrals: ', response.data);
    res.status(200).json({ message: 'success', data: response.data });
  })
  .catch((error) => {
    console.log(error);
    res.status(400).json({ message: 'error', data: error });
  });
}
