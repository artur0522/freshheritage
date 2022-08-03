import { useState, useRef, createRef } from 'react'
import classes from './ContactUs.module.scss'

const ContactUs = ({fields}) => {
  const { header } = fields
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(true)
  const refs = ['first_name', 'last_name', 'email', 'phone', 'subject', 'message']

  const formRef = useRef(refs.reduce((carry, ref) => {
    return {
      ...carry,
      [ref]: createRef()
    }
  }, {}))

  const onSubmit = async (e) => {
    e.preventDefault()

    const data = {};

    for (const keyName of Object.keys(formRef.current)) {
      const value = formRef.current[keyName].current.value
      data[keyName] = value
    }

    const response = await fetch('/api/zendesk/create-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: JSON.stringify(data)
    })

    if (response && response.statusText === 'Created') {
      setFormSubmitted(true)
      setShowErrorMessage(false)
    } else {
      setShowErrorMessage(true)
    }
  }

  if (formSubmitted) {
    return (
      <div className={classes['contact-us']}>
        <h1 className="text-align--center">Thank you!<br />We'll get back to you as soon as possible.</h1>
      </div>
    )
  }

  return (
    <div className={classes['contact-us']}>
      <h1>{header}</h1>
      <form className={classes['contact-us__form']} onSubmit={(e) => onSubmit(e)}>
        <div className="input-group--wrapper">
          <div className="input-group">
            <label className="label label--block secondary--body">First Name</label>
            <input className="input" type="text" placeholder="First Name" ref={formRef.current.first_name} required />
          </div>
          <div className="input-group">
            <label className="label label--block secondary--body">Last Name</label>
            <input className="input" type="text" placeholder="Last Name" ref={formRef.current.last_name} required />
          </div>
        </div>
        <div className="input-group--wrapper">
          <div className="input-group">
            <label className="label label--block secondary--body">Email Address</label>
            <input className="input" type="email" placeholder="Email Address" ref={formRef.current.email} required />
          </div>
          <div className="input-group">
            <label className="label label--block secondary--body">Phone Number</label>
            <input
              className="input"
              type="text"
              placeholder="Phone Number"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              ref={formRef.current.phone}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="label label--block secondary--body">Subject</label>
          <input className="input" type="text" placeholder="Subject Name" ref={formRef.current.subject} required />
        </div>

        <div className="input-group">
          <label className="label label--block secondary--body">Your Message</label>
          <textarea className="textarea" type="text" placeholder="Your questions or comments" ref={formRef.current.message} required />
        </div>

        <div className={classes['contact-us__submit']}>
          <button className="btn sitkablue">Submit</button>
        </div>

        {showErrorMessage &&
          <p className={classes['contact-us__error']}>Sorry, an error has occurred. Please try again or email salmonsupport@sitkasalmonshares.com for assistance</p>
        }

      </form>
    </div>
  )
}

export default ContactUs