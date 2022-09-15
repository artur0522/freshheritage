import React from 'react'
import classes from './ReferralActivity.module.scss'
import { uniqueId } from 'lodash-es'
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

export default function ReferralActivity({referrals, referralsLoaded}) {

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
      <div className={classes['status']}>Referral Status</div>
      { renderReferrals() }
    </div>
  )
}
