import React from 'react'

import FooterEmailSignup from '../Layout/Footer/FooterEmailSignup'

import classes from "../Layout/Footer/Footer.module.scss"
import styles from "./EmailSignup.module.scss"

const EmailSignup = ({fields}) => {
  return (
    <div className={`${styles['email-signup']}`}>
      <div className="container">
        <FooterEmailSignup props={fields.emailSignup} classes={classes} />
      </div>
    </div>
  )
}

export default EmailSignup