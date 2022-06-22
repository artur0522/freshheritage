import React from 'react'

import FooterEmailSignup from '../Layout/Footer/FooterEmailSignup'

import classes from "../Layout/Footer/Footer.module.scss"

const EmailSignup = ({fields}) => {
    console.log(fields)
  return (
    <div className="container">
        <FooterEmailSignup props={fields.emailSignup} classes={classes} />
    </div>
  )
}

export default EmailSignup