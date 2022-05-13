import {useState} from 'react';
import ReactHtmlParser from 'react-html-parser';

import classes from './PrimaryAnnouncement.module.scss';
import IconClose from '@/svgs/close.svg';

const PrimaryAnnouncement = ({props}) => {
  const [show, setShow] = useState(true)
  if (!show) {
    return ''
  }
  return (
    <div className={classes.primaryAnnouncement}>
      <button onClick={() => setShow(!show)}><IconClose /></button>
      <div>{ReactHtmlParser(props.announcementText)}</div>
    </div>
  );
};

export default PrimaryAnnouncement;