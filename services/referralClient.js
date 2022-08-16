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
