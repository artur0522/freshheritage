import { useModalContext } from '@/context/ModalContext'
import classes from "./CookingClassSignupForm.module.scss"
import EmailSignup from '../EmailSignup'
import moment from 'moment'
import { ics, google } from "calendar-link";
import IconPlusCircle from '@/svgs/plus-circle.svg'

const CookingClassSignupForm = () => {
  const { content } = useModalContext()

  if (!content.classStartDate || !content.classEndDate) {
    return ''
  }

  const startDateTextFormatted = moment(content.classStartDate).format('dddd MMMM Do YYYY h:mm')
  const startDateEventFormatted = moment(content.classStartDate).format('YYYY-MM-DD HH:mm:ss')
  const endDateEventFormatted = moment(content.classEndDate).format('YYYY-MM-DD HH:mm:ss')

  const event = {
    title: `Live Cooking Class - ${content.header}`,
    start: `${startDateEventFormatted} -0500`,
    end: `${endDateEventFormatted} -0500`,
  };

  return (
    <div className={`${classes['cooking-class-signup-form']} container`}>
      <h2 className="h4">{content.header}</h2>
      <h4>Class Starts On</h4>
      <h6 className={classes['cooking-class-signup-time']}>{startDateTextFormatted}pm CT</h6>
      <div className={classes['cooking-class-signup-container']}>
        <EmailSignup props={{
          title: 'Email Signup',
          ctaText: 'Sign Me Up',
          listId: content.listId
        }} />
      </div>

      <ul className={classes['cooking-class-calendar-links']}>
        <li>
          <a href={google(event)} target="_blank" rel="noreferrer"><IconPlusCircle /><h2>Add to Google Calendar</h2></a>
        </li>
        <li>
          <a href={ics(event)}><IconPlusCircle /><h2>Add to iCal</h2></a>
        </li>
      </ul>
    </div>
  )
}

export default CookingClassSignupForm
