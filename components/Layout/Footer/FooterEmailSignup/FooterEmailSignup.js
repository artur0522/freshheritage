import {useRef, useState} from 'react'
import IconEnvelope from '@/svgs/envelope.svg'

const FooterEmailSignup = ({props, classes}) => {

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const emailRef = useRef()

  const submitForm = (e) => {
    e.preventDefault()
    fetch('/api/klaviyo/klaviyo-add-to-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailRef.current.value,
        list_id: 'MuPGVv',
      })
    })
    .then(res => res.json())
    .then((data) => {
      if (data.message === 'success') {
        setShowSuccessMessage(true)
        setShowErrorMessage(false)
      } else {
        setShowErrorMessage(true)
      }
    })
  }

  return (
    <div className={[classes.footerSection, classes.footerEmailSignup].join(' ')}>
      <div className={[classes.footerBlock, classes.footerEmailContent].join(' ')}>
        <h2 className={classes.footerEmailHeading}>{props.header}</h2>
        <p className={classes.footerEmailDescription}>{props.description}</p>
      </div>
      <div className={[classes.footerBlock, classes.footerEmailFormContainer].join(' ')}>
        {showSuccessMessage ? (
          <p className={classes.footerEmailTextSuccess}>Thank you for subscribing! Check your inbox!</p>
        ):(
          <form onSubmit={(e) => submitForm(e)} className={classes.footerEmailForm}>
            <div className="input-group">
              <input className="input" name="email" type="email" placeholder="email address" ref={emailRef} />
              <IconEnvelope />
            </div>
            <button className="btn salmon">{props.ctaText}</button>
            {showErrorMessage &&
              <p className={classes.footerEmailTextError}>Sorry, an error has occurred. Please try again or email salmonsupport@sitkasalmonshares.com for assistance</p>
            }
          </form>
        )}
      </div>
    </div>
  )
}

export default FooterEmailSignup