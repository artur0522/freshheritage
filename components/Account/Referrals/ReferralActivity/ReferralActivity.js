import React, { useEffect, useState } from 'react'
import classes from './ReferralActivity.module.scss'
import { uniqueId } from 'lodash-es'
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

export default function ReferralActivity({customer}) {
  const [referrals, setReferrals] = useState(undefined)
  const [activeReferrals, setActiveReferrals] = useState(0)
  const [referralsLoaded, setReferralsLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      const idArr = customer.id.split('/')
      const id = idArr[idArr.length - 1]

      const result = await fetch(`/api/account/get-referrals?cID=${id}`, {
        method: 'GET',
      }).then((res) => res.json())

      if (result.message === 'success') {
        setReferrals(result.data)
        const num = 0
        result.data.forEach(r => {
          if (r.isActive)
            num++
        });
        setActiveReferrals(num)
      }
      setReferralsLoaded(true)
    }

    load()
  }, [customer.id])

  const renderReferrals = () => {
    if (referralsLoaded) {
      return referrals.map(referral => (
        <div key={referral.referree_email + uniqueId()} className={classes['referree-box']}>
          <div className={classes['text']}>
            <div className={classes['name']}>{referral.referree_name}</div>
            <div className={classes['email']}>{referral.referree_email}</div>
          </div>
          <div className={referral.isActive ? classes['joined'] : classes['not-joined']}>
            {referral.isActive ? <CheckIcon/> : <CloseIcon />}&nbsp;
            <span>{referral.isActive ? 'Became A Member' : 'Has Not Joined'}</span>
          </div>
        </div>
      ))
    } else {
      return (
        <div>Loading...</div>
      )
    }
  }

  return (
    <div className={classes['referral-activity']}>
      <h2>
        <span className={classes['salmon']}>{activeReferrals}</span> Of Your Referrees Have Been Active In The Past 30 Days
      </h2>
      <div className={classes['banner']}>
        You&apos;ll get <span className={classes['salmon']}>$10 Off</span> Your Next Order!
      </div>
      <h4>Referral Status</h4>
      { renderReferrals() }
    </div>
  )
}
