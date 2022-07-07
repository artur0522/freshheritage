import { useModalContext } from '@/context/ModalContext'
import classes from "./CookingClassSignupForm.module.scss"
import EmailSignup from '../EmailSignup'
import moment from 'moment'

const CookingClassSignupForm = () => {
  const { content } = useModalContext()

  const date = moment(content.classStartDate).format('dddd MMMM Do YYYY h:mm')

  return (
    <div className={`${classes['cooking-class-signup-form']} container`}>
      <h2 className="h4">{content.header}</h2>
      <h4>Class Starts On</h4>
      <h6 className={classes['cooking-class-signup-time']}>{date}pm CT</h6>
      <div className={classes['cooking-class-signup-container']}>
        <EmailSignup props={{
          title: 'Email Signup',
          ctaText: 'Sign Me Up',
          listId: ''
        }} />
      </div>
    </div>
  )
}

export default CookingClassSignupForm
