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
      },
      blockquote: ({children}) => {
        return <div className={classes['article-blockquote']}>
          <div className={classes['article-blockquote__bracket-outer']}></div>
          <div className={classes['article-blockquote__bracket-upper']}></div>
          <div className={classes['article-blockquote__bracket-lower']}></div>
          <blockquote>{children}</blockquote>
        </div>
      }
    },
    marks: {
      arrowLink: ({ children, value }) => (<Link href={value.href || ''}>
        <a className={classes['article-section__arrow-link']}>{children}<IconCaretThin /></a>
      </Link>),
      color: ({ children, value}) => {
        return <span style={{'color': value.hex }}>{children}</span>
      },
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
    types: {
      image: ({value}) => {
        if (value.link) {
          return <div className={classes['article-section__image']}>
            <Link href={value.link}>
              <a>
                <ResponsiveImage src={value.asset.url} alt={value.asset.alt || ''} />
              </a>
            </Link>
            {value.caption && <span className={classes['article-section__image-caption']}>{value.caption}</span>}
          </div>
        }
        return (
          <div className={classes['article-section__image']}>
            {value?.asset &&
              <ResponsiveImage src={value.asset.url} alt={value.asset.alt || ''} />
            }
            {value.caption && <span className={classes['article-section__image-caption']}>{value.caption}</span>}
          </div>
        )
      },
      iconWithTextBlock: ({value}) => {
        const iconUrl = value.icon?.image.asset.url
        return (<p className={classes['article-section__cooking-tool']}>
          <span className={classes['article-section__cooking-tool-icon']}><Image src={iconUrl} layout="fill" alt={value.text} /></span>
          <span className={classes['article-section__cooking-tool-text']}>{value.text}</span>
        </p>)
      },
      productBlock: ({value}) => {
        if (!products || products.length < 1) return <></>
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