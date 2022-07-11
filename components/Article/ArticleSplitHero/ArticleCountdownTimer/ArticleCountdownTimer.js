import { useTimer } from 'react-timer-hook'
import moment from 'moment'
import { useModalContext } from '@/context/ModalContext'
import Link from 'next/link'

const ArticleCountdownTimer = ({classes, classStartDate, classEndDate}) => {

  const { setIsOpen, setModalType } = useModalContext()
  const expiryTimestamp = new Date(classStartDate)

  const {
    minutes,
    hours,
    days,
    isRunning
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') })

  const unixNowDate = moment().unix()
  const unixEndDate = moment(classEndDate).unix()

  if (isRunning && unixNowDate < unixEndDate) {
    return (
      <div className={classes['article-hero__countdown-timer']}>
        <h4>Next Class Starts In</h4>
        <ul>
          <li>Days: {days}</li>
          <li>Hours: {hours}</li>
          <li>Minutes: {minutes}</li>
        </ul>
        <button onClick={() => {
          setModalType('cooking_class_signup')
          setIsOpen(true)}
        }
        className={`${classes['article-hero__action-btn']} btn salmon`}>Sign Me Up</button>
      </div>
    )
  }

  if (!isRunning && unixNowDate > unixEndDate) {
    return (
      <div className={classes['article-hero__countdown-timer']}>
        <h4>This Live Class Has Ended</h4>
        <ul></ul>
        <Link href="/blogs/culinary/live-cooking-classes">
          <a className={`${classes['article-hero__action-btn']} btn salmon`}>View All Cooking Classes</a>
        </Link>
      </div>
    )
  }

  return ''

}

export default ArticleCountdownTimer