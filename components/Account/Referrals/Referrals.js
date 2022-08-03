import React, { useState } from 'react'
import Image from 'next/image'
import classes from './Referrals.module.scss'

import banner from './referral-dinner.png'

export default function ReferralsPage() {
  const [name, setName] = useState()

  const submitForm = (e) => {
    e.preventDefault()
    const name = e.target.name.value;
    const email = e.target.email.value;
    console.log(`${name} ${email}`)
  }

  return (
    <div className={classes['referrals']}>
      {/* Left col */}
      <div className={classes['col']}>
        <h4>Refer a Friend</h4>
        <h1>
          Get <span className={classes['highlight']}>$10 Off Every Month</span>{' '}
          for <span className={classes['highlight']}>Every</span> Referral!
        </h1>
        <div className={classes['banner']}>
          <Image
            src={banner.src}
            alt="Alana serving Sitka's seafood during a summer dinner"
            layout="responsive"
            height={294}
            width={520}
          />
        </div>
        <p className={classes['text']}>
          Give your friends and family $25 off their first subscription box, and
          get $10 back for every friend who signs up, every month that they have
          an active membership! This means that if you refer two new members,
          you’ll get $20 off your membership each month that they stay active...
          All the way up to the total value of your monthly membership! Just add
          their name and email below, or post to social media using one of the
          icons below. Share your love of high-quality, sustainably-caught
          seafood! <a className={classes['highlight']}>Terms and conditions</a>{' '}
          apply.
        </p>
        <form onSubmit={submitForm}>
          <div className={classes['input-container']}>
            <input
              type="text"
              name="name"
              placeholder="Friend's name"
            />
          </div>
          <div className={classes['input-container']}>
            <input
              type="text"
              name="email"
              placeholder="Friend's Email Address"
            />
          </div>
          <button type="submit" value="Submit">
            Submit
          </button>
        </form>
      </div>

      {/* Right col */}
      <div className={classes['col']}>hi </div>
    </div>
  )
}
