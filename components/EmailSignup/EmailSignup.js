import {useRef, useState} from 'react'
import IconEnvelope from '@/svgs/envelope.svg'
import classes from './EmailSignup.module.scss'

const EmailSignup = ({props}) => {

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const emailRef = useRef()

  const { title, ctaText, listId } = props

  const submitForm = (e) => {
    e.preventDefault()
    fetch('/api/klaviyo/klaviyo-add-to-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailRef.current.value,
        list_id: listId,
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
    <div className={classes['email-signup']}>
      {title &&
        <h2>{title}</h2>
      }
      {showSuccessMessage ? (
        <p className={classes['email-signup__text-success']}>Thank you for subscribing! Check your inbox!</p>
      ):(
        <form onSubmit={(e) => submitForm(e)} className={classes['email-signup__form']}>
          <div className="input-group">
            <input className="input" name="email" type="email" placeholder="email address" ref={emailRef} />
            <IconEnvelope />
          </div>
          <button className="btn salmon">{ctaText}</button>
          {showErrorMessage &&
            <p className={classes['email-signup__text-error']}>Sorry, an error has occurred. Please try again or email salmonsupport@sitkasalmonshares.com for assistance</p>
          }
        </form>
      )}
    </div>
  )
}

export default EmailSignup