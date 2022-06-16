import {useState, useEffect} from 'react'
import ReactHtmlParser from 'react-html-parser'
import * as Cookies from 'es-cookie';

import classes from './PrimaryAnnouncement.module.scss'
import IconClose from '@/svgs/close.svg'

const PrimaryAnnouncement = ({props}) => {

  const [show, setShow] = useState(false)

  useEffect(() => {
    const hidePrimaryAnnoucement = Cookies.get('hidePrimaryAnnoucement')
    setShow(hidePrimaryAnnoucement == 'true' ? false : true)
  }, []);

  const removeAnnoucemet = () => {
    setShow(!show)
    Cookies.set('hidePrimaryAnnoucement', 'true', { expires: 1, path: '/' })
  }

  if (!show) {
    return ''
  }
  return (
    <div className={classes.primaryAnnouncement}>
      <button onClick={() => removeAnnoucemet()}><IconClose /></button>
      <div className={classes.primaryAnnouncementCopy}>{ReactHtmlParser(props.announcementText)}</div>
    </div>
  )
}

export default PrimaryAnnouncement