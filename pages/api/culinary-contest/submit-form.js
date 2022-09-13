/* /api/culinary-contest */
import axios from 'axios'
import { withSentry } from "@sentry/nextjs";


// export default async function handler(req, res) {
const handler = async (req, res) => {

  const formData = req.body

  axios.post('https://davis.sitkasalmonshares.com/contest', formData, {
    'content-type': 'multipart/form-data',
  }).then((response) => {
    console.log(response);
    res.status(201).json({ message: 'success' });
  })
  .catch((err) => {
    // console.log(error);
    res.status(400).json({ message: 'error', data: err });
  });

};

export default withSentry(handler);