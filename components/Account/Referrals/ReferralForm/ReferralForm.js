import React, { useState } from 'react'
import Image from 'next/image'
import classes from './ReferralForm.module.scss'
import { submitReferral } from 'services/referralClient'
import facebookLogo from './facebook.png'
import twitterLogo from './twitter.png'
import linkedinLogo from './linkedin.png'
import banner from './referral-dinner.png'

export default function ReferralForm({ customer }) {
  const [submittingForm, setSubmittingForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const submitForm = async (e) => {
    e.preventDefault()

    setSubmittingForm(true)
    const idArr = customer.id.split('/')
    const id = idArr[idArr.length - 1]
    const successful = await submitReferral(id, name, email)
    if (!successful) {
      alert('Your referral did not work. Please try again')
    }
    setSubmittingForm(false)
    resetForm()
  }

  const resetForm = () => {
    setName('')
    setEmail('')
  }

  return (
    <div className={classes['referral-form']}>
      <h4>Refer a Friend</h4>
      <h1>
        Get <span className={classes['highlight']}>$10 Off Every Month</span>{' '}
        for <span className={classes['highlight']}>Every</span> Referral!
      </h1>
      <div className={classes['banner']}>
        <Image
          src={banner.src}
          alt="Alana serving Sitka's seafood during a summer dinner"
          layout="intrinsic"
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={classes['input-container']}>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Friend's Email Address"
          />
        </div>
        <button
          type="submit"
          value="Submit"
          disabled={submittingForm || !email || !name}
        >
          {submittingForm ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      <div className={classes['social-links']}>
        <a href="crouton.net">
          <Image
            src={facebookLogo.src}
            alt="Facebook icon"
            layout="fixed"
            height={32}
            width={32}
          />
        </a>
        <a href="crouton.net">
          <Image
            src={twitterLogo.src}
            alt="Twitter icon"
            layout="fixed"
            height={32}
            width={32}
          />
        </a>
        <a href="crouton.net">
          <Image
            src={linkedinLogo.src}
            alt="Linkedin icon"
            layout="fixed"
            height={32}
            width={32}
          />
        </a>
      </div>
    </div>
  )
}
