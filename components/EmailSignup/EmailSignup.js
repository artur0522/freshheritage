import {useRef, useState} from 'react'
import IconEnvelope from '@/svgs/envelope.svg'
import classes from './EmailSignup.module.scss'
import { useAnalytics, useErrorLogging } from '@/hooks/index.js';

const EmailSignup = ({ props }) => {

  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const emailRef = useRef()
  const customCheckBoxRef = useRef()

  const { title, ctaText, listId, customCheckbox } = props

  const responseHandler = (data) => {
    if (data.message === 'success') {
      setShowSuccessMessage(true)
      setShowErrorMessage(false)
    } else {
      setShowErrorMessage(true)
      return false
    }
  }

  const submitForm = async (e) => {
    e.preventDefault()

    const response = await fetch('/api/klaviyo/klaviyo-add-to-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: JSON.stringify({
        email: emailRef.current.value,
        list_id: listId,
      })
    })
    .then(res => res.json())
    .then((data) => {
      console.log('log signup list',props);
      const trackEvent = useAnalytics();
      trackEvent('email_signup',props.listId);
      if (data.message === 'success' && customCheckBoxRef?.current?.checked) {
        return true
      }
      responseHandler(data)
    })

    if (customCheckBoxRef?.current?.checked && response) {
      fetch('/api/klaviyo/klaviyo-update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          '$email': emailRef.current.value,
          [`${customCheckbox.checkboxKlaviyoProperty} - ${listId}`]: 'true',
        })
      })
      .then(res => res.json())
      .then((data) => {
        responseHandler(data)
      })
    }
  }

  if (!listId) {
    return 'Missing list ID'
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
          {customCheckbox && <div className="input-group">
            <div className="input-group--flex">
              <input className="input" id="custom_checkbox" type="checkbox" ref={customCheckBoxRef} />
              {customCheckbox.label && <label htmlFor="custom_checkbox">{customCheckbox.label}</label>}
            </div>
            {customCheckbox.disclaimer && <p className={classes['email-signup__disclaimer']}>{customCheckbox.disclaimer}</p>}
          </div>}
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