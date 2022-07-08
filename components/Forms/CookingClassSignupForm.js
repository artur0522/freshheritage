import { useModalContext } from '@/context/ModalContext'
import classes from "./CookingClassSignupForm.module.scss"
import EmailSignup from '../EmailSignup'
import moment from 'moment'
import { googleCalendarEventUrl } from 'google-calendar-url'
import IconPlusCircle from '@/svgs/plus-circle.svg'

const googleTimeConverter = (date) => {
  return date.toISOString().replace(/-|:|\.\d\d\d/g,"")
}

const CookingClassSignupForm = () => {
  const { content } = useModalContext()

  if (!content.classStartDate) {
    return ''
  }

  const dateFormatted = moment(content.classStartDate).format('dddd MMMM Do YYYY h:mm')
  const dateEndTime = moment(content.classStartDate).add(1, 'hours')

  const url = googleCalendarEventUrl({
    start: googleTimeConverter(new Date(content.classStartDate)),
    end: googleTimeConverter(new Date(dateEndTime)),
    title: `Live Cooking Class - ${content.header}`,
    details: 'Event details'
  })

  return (
    <div className={`${classes['cooking-class-signup-form']} container`}>
      <h2 className="h4">{content.header}</h2>
      <h4>Class Starts On</h4>
      <h6 className={classes['cooking-class-signup-time']}>{dateFormatted}pm CT</h6>
      <div className={classes['cooking-class-signup-container']}>
        <EmailSignup props={{
          title: 'Email Signup',
          ctaText: 'Sign Me Up',
          listId: content.listId
        }} />
      </div>

      <ul className={classes['cooking-class-calendar-links']}>
        <li>
          <a href={url} target="_blank"><IconPlusCircle /><h2>Add to Google Calendar</h2></a>
        </li>
      </ul>
    </div>
  )
}

export default CookingClassSignupForm
