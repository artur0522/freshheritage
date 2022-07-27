import React from 'react'
import classes from './WYSIWYG.module.scss'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import Video from '@/components/Video'
import ResponsiveImage from '@/components/ResponsiveImage'

const WYSIWYG = ({fields}) => {

  const myPortableTextComponents = {
    marks: {
      link: ({children, value}) => {
        if (value.href.includes('mailto')) {
          return <a rel="noreferrer noopener" href={value.href} target="_blank">{children}</a>
        }
        return (
          <Link href={value.href}>
            <a>{children}</a>
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
      youtubeVideoBlock: ({value}) => <Video youtubeVideoId={value.youtubeVideoId} autoplay={false} startVideo="true" className={classes['wysiwyg__video']} />,
      valuePropsBlock:({value}) => {
        let valuePropsKeys = Object.keys(value).filter(key => key.includes('valueProp'))
        if (valuePropsKeys.length < 1) return ''
        valuePropsKeys = valuePropsKeys.sort()
        return <ul className={classes['wysiwyg__value-props']}>
          {valuePropsKeys.map(key => {
            const valueProp = value[key]
            const image = valueProp.image
            return (<li key={key} className={classes['wysiwyg__value-prop']}>
              <div className={classes['wysiwyg__value-prop-container']}>
                {image.asset && <div className={classes['wysiwyg__value-prop-image']}>
                  <ResponsiveImage src={image.asset.url} alt={valueProp.text} />
                </div>}
                <h3>{valueProp.text}</h3>
              </div>
            </li>)
          })}
        </ul>
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