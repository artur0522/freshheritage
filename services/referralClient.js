export const submitReferral = (customer, name, email) => {
  return fetch(`https://davis.sitkasalmonshares.com/refer`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer q7NdvLJNrZq3eLyHMQg8RBWRBpgzUFTh4F6Zr`,
    },
    body: JSON.stringify({
      referer: customer,
      email,
      name,
    }),
  }).then(res => {
    if (res.ok) {
      return true
    }
    return false;
  }).catch(err => {
    return false;
  });
}

export const getReferrals = (customerId) => {
  return fetch(`https://davis.sitkasalmonshares.com/getReferrals?cID=${customerId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer q7NdvLJNrZq3eLyHMQg8RBWRBpgzUFTh4F6Zr`,
    },
  }).then(res => {
    if (res.ok) {
      return res.json()
    }
    return false;
  }).catch(err => {
    return false;
  });
}
