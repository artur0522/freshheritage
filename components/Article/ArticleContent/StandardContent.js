import React, { forwardRef } from 'react'
import ResponsiveImage from '@/components/ResponsiveImage'
import { PortableText } from '@portabletext/react'
import classes from './ArticleContent.module.scss'
import ArticleProduct from '../ArticleProduct'
import ArticleSocialSharing from '../ArticleSocialSharing'
import Link from 'next/link'
import Image from 'next/image'
import IconCaretThin from '@/svgs/caret-thin.svg'
import IconKnife from '@/svgs/knife.svg'
import IconPan from '@/svgs/pan.svg'
import Video from '@/components/Video'

const StandardContent = forwardRef(({fields, products}, ref) => {

  const { content } = fields

  const myPortableTextComponents = {
    block: {
      h1: ({children}) => {
        if (ref.current[children[0]]) {
          return <h1 ref={ref.current[children[0]]}>{children}</h1>
        }
        return <h1>{children}</h1>
      }
    },
    marks: {
      arrowLink: ({ children, value }) => (<Link href={value.href || ''}>
        <a className={classes['article-section__arrow-link']}>{children}<IconCaretThin /></a>
      </Link>)
    },
    types: {
      image: ({value}) => (<div className={classes['article-section__image']}>
        <ResponsiveImage src={value.asset.url} alt={value.asset.alt || ''} />
      </div>),
      iconWithTextBlock: ({value}) => {
        const iconUrl = value.icon?.image.asset.url
        return (<p className={classes['article-section__cooking-tool']}>
          <span className={classes['article-section__cooking-tool-icon']}><Image src={iconUrl} layout="fill" alt={value.text} /></span>
          <span className={classes['article-section__cooking-tool-text']}>{value.text}</span>
        </p>)
      },
      productBlock: ({value}) => {
        const product = products.find(product => product.content.handle === value.product)
        return <ArticleProduct product={product} parentClasses={classes} />
      },
      youtubeVideoBlock: ({value}) => <Video youtubeVideoId={value.youtubeVideoId} autoplay={false} startVideo="true" className={classes['article-section__video']} />
    },
    listItem: {
      bullet: ({children}) => {
        return (
          <li className="body">{children}</li>
        )
      }
    }
  }
  return (
    <div className={`${classes['article-content']}`}>

      <ArticleSocialSharing seo={fields.seo} />

      <div className={classes['article-section']}>
        <div className={classes['article-section__content']}>
          <PortableText components={myPortableTextComponents} value={content} />
        </div>
      </div>
    </div>
  )
})

export default StandardContent