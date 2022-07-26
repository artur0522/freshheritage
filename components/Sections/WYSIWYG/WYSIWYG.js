import React from 'react'
import classes from './WYSIWYG.module.scss'
import { PortableText } from '@portabletext/react'

const WYSIWYG = ({fields}) => {

  const myPortableTextComponents = {
    listItem: {
      bullet: ({children}) => {
        return (
          <li className="body">{children}</li>
        )
      }
    }
  }

  return (
    <div className={classes['wysiwyg']}>
      <PortableText components={myPortableTextComponents} value={fields.content} />
    </div>
  )
}

export default WYSIWYG