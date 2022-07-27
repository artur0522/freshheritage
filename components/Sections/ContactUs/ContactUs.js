import { useRef, createRef } from 'react'
import classes from './ContactUs.module.scss'
import axios from 'axios';

const ContactUs = ({fields}) => {
  const { header } = fields
  const refs = ['first_name', 'last_name', 'email', 'phone', 'subject', 'message']

  const formRef = useRef(refs.reduce((carry, ref) => {
    return {
      ...carry,
      [ref]: createRef()
    }
  }, {}))

  const onSubmit = () => {
    // e.preventDefault()

    // const formData = new FormData();

    // for (const file of files) {
    //   formData.append(file.name, file);
    // }

    // for (const keyName of Object.keys(formRef.current)) {
    //   const value = formRef.current[keyName].current.value
    //   formData.append(keyName, value)
    // }

    // axios.post('/api/culinary-contest/submit-form', formData, {
    //   'content-type': 'multipart/form-data'
    // })
    // .then(({data}) => {
    //   if (data.message === 'success') {
    //     setFormSubmitted(true)
    //   }
    // })
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
          <input className="input" type="text" placeholder="Recipe Name" ref={formRef.current.subject} required />
        </div>

        <div className="input-group">
          <label className="label label--block secondary--body">Your Message</label>
          <textarea className="textarea" type="text" placeholder="Include your recipe, ingredients and steps." ref={formRef.current.message} required />
        </div>

        <div className={classes['contact-us__submit']}>
          <button className="btn sitkablue">Submit</button>
        </div>

      </form>
    </div>
  )
}

export default ContactUs