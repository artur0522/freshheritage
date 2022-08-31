const dateAtMidnight = (date) => {
  let newDate = new Date(date.getTime());
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
};

const formatDateForBold = (date) => {

  const dateString = dateAtMidnight(new Date(date)).toISOString();
  const lastDot = dateString.lastIndexOf(".");
  return lastDot === -1 ? dateString : `${dateString.slice(0, lastDot)}Z`;
};

export default async function handler(req, res) {

  const jsonBody = JSON.parse(req.body);
  jsonBody.subscription_next_orderdate = formatDateForBold(jsonBody.subscription_next_orderdate);

  const url = 'https://davis.sitkasalmonshares.com/update_shipdate';

  const config = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.DAVIS_KEY,
      'origin': 'pwa'
    },
    body: JSON.stringify(jsonBody),
  };

  console.log('config', config);

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
