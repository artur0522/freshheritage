import parse from 'html-react-parser'
import { useHeaderContext } from '@/context/HeaderContext'

import classes from './PrimaryAnnouncement.module.scss'
import IconClose from '@/svgs/close.svg'

const PrimaryAnnouncement = ({props}) => {

  const { showAnnoucementBar, removeAnnoucementBar } = useHeaderContext()

  if (!showAnnoucementBar) {
    return ''
  }
  return (
    <div className={classes.primaryAnnouncement}>
      <button onClick={() => removeAnnoucementBar()}><IconClose /></button>
      <div className={classes.primaryAnnouncementCopy}>{parse(props.announcementText)}</div>
    </div>
  )
}

export default PrimaryAnnouncement