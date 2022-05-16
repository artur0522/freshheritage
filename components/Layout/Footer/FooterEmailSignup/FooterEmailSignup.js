import {useRef} from 'react'
import IconEnvelope from '@/svgs/envelope.svg'

const FooterEmailSignup = ({props, classes}) => {

  const emailRef = useRef()

  const submitForm = (e) => {
    e.preventDefault()
    console.log(emailRef.current.value)
  }

  return (
    <div className={[classes.footerSection, classes.footerEmailSignup].join(' ')}>
      <div className={[classes.footerBlock, classes.footerEmailContent].join(' ')}>
        <h2 className={classes.footerEmailHeading}>{props.header}</h2>
        <p className={classes.footerEmailDescription}>{props.description}</p>
      </div>
      <div className={[classes.footerBlock, classes.footerEmailFormContainer].join(' ')}>
        <form onSubmit={(e) => submitForm(e)} className={classes.footerEmailForm}>
          <div className="input-group">
            <input className="input" name="email" type="email" placeholder="email address" ref={emailRef} />
            <IconEnvelope />
          </div>
          <button className="btn salmon">{props.ctaText}</button>
        </form>
      </div>
    </div>
  )
}

export default FooterEmailSignup