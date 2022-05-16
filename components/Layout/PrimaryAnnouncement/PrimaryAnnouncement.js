import {useState} from 'react';
import ReactHtmlParser from 'react-html-parser';
import Cookies from 'universal-cookie';

import classes from './PrimaryAnnouncement.module.scss';
import IconClose from '@/svgs/close.svg';

const PrimaryAnnouncement = ({props}) => {

  const cookies = new Cookies();
  const hidePrimaryAnnoucement = cookies.get('hidePrimaryAnnoucement')
  const [show, setShow] = useState(hidePrimaryAnnoucement == 'true' ? false : true)

  const removeAnnoucemet = () => {
    setShow(!show)
    cookies.set('hidePrimaryAnnoucement', 'true', { maxAge: 86400, path: '/' })
  }

  if (!show) {
    return ''
  }
  return (
    <div className={classes.primaryAnnouncement}>
      <button onClick={() => removeAnnoucemet()}><IconClose /></button>
      <div>{ReactHtmlParser(props.announcementText)}</div>
    </div>
  );
};

export default PrimaryAnnouncement;