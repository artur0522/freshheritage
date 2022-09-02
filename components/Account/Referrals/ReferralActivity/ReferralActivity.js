import React from 'react'
import classes from './ReferralActivity.module.scss'
import { uniqueId } from 'lodash-es'
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { getReferrals } from 'services/referralClient'

export default function ReferralActivity({customer}) {
  const numberOfActiveReferrees = 1;



  const load = async () => {
    const idArr = customer.id.split('/')
    const id = idArr[idArr.length - 1]

    // TODO - Swap this out with the actual id
    const test = await getReferrals(5140795326548);
    console.log(test);
  }

  load();

  const referrals = [
    {
      name: 'Jane Deer',
      email: 'crouton@crouton.net',
      joined: false
    },
    {
      name: 'Test Customer',
      email: 'crouton@crouton.net',
      joined: true
    },
    {
      name: 'Jane Deer',
      email: 'crouton@crouton.net',
      joined: true
    },
    {
      name: 'Steve Brule',
      email: 'crouton@crouton.net',
      joined: false
    },
  ]

  const renderReferrals = () => {
    return referrals.map(referral => (
      <div key={referral.email + uniqueId()} className={classes['referree-box']}>
        <div className={classes['text']}>
          <div className={classes['name']}>{referral.name}</div>
          <div className={classes['email']}>{referral.email}</div>
        </div>
        <div className={referral.joined ? classes['joined'] : classes['not-joined']}>
          {referral.joined ? <CheckIcon/> : <CloseIcon />}&nbsp;
          <span>{referral.joined ? 'Became A Member' : 'Has Not Joined'}</span>
        </div>
      </div>
    ))
  }

  return (
    <div className={classes['referral-activity']}>
      <h2>
        <span className={classes['salmon']}>{numberOfActiveReferrees}</span> Of Your Referrees Has Been Active In The Past 30 Days
      </h2>
      <div className={classes['banner']}>
        You&apos;ll get <span className={classes['salmon']}>$10 Off</span> Your Next Order!
      </div>
      <h4>Referral Status</h4>
      { renderReferrals() }
    </div>
  )
}
