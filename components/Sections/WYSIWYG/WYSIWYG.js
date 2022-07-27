import React from 'react'
import classes from './WYSIWYG.module.scss'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import Video from '@/components/Video'

const WYSIWYG = ({fields}) => {

  const myPortableTextComponents = {
    marks: {
      link: ({children, value}) => {
        const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
        if (value.href.includes('mailto')) {
          return <a href={value.href} target="_blank">{children}</a>
        }
        return (
          <Link href={value.href}>
            <a rel={rel}>{children}</a>
          </Link>
        )
      }
    },
    listItem: {
      bullet: ({children}) => {
        return (
          <li className="body">{children}</li>
        )
      },
      number: ({children}) => {
        return (
          <li className="body">{children}</li>
        )
      }
    },
    types: {
      youtubeVideoBlock: ({value}) => <Video youtubeVideoId={value.youtubeVideoId} autoplay={false} startVideo="true" className={classes['wysiwyg__video']} />
    }
  }

  return (
    <div className={classes['wysiwyg']}>
      <PortableText components={myPortableTextComponents} value={fields.content} />
    </div>
  )
}

export default WYSIWYG