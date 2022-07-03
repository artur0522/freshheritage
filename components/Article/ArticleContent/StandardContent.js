import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import ResponsiveImage from '@/components/ResponsiveImage'
import { PortableText } from '@portabletext/react'
import classes from './ArticleContent.module.scss'
import Link from 'next/link'
import IconThreeDotsCircle from '@/svgs/three-dots-circle.svg'
import IconPrinter from '@/svgs/printer.svg'
import IconBookmark from '@/svgs/bookmark.svg'
import IconShare from '@/svgs/share.svg'
import IconStar from '@/svgs/empty-star.svg'
import ArticleProduct from '../ArticleProduct'

const StandardContent = ({fields, product}) => {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )

  const { content } = fields

  console.log("content:", content)
  console.log("product:", product)

  const myPortableTextComponents = {
    types: {
      image: ({value}) => (<div className={classes['article-section__image']}>
        <ResponsiveImage src={value.asset.url} alt={value.asset.alt || ''} />
      </div>),
      productBlock: () => (
        <ArticleProduct product={product} parentClasses={classes} />
      )
    },
    listItem: {
      bullet: ({children}) => {
        return (
          <li class="body">{children}</li>
        )
      }
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`${classes['article-content']}`}>

      {/* social sharing  */}
      <ul className={classes['article-social-sharing']}>
        {/* <li>
          <button>
            <IconBookmark /><span>Save</span>
          </button>
        </li> */}
        <li>
          <button>
            <IconShare /><span>Share</span>
          </button>
        </li>
        {isMobile && mounted && <li>
          <button className={classes['more-info-btn']}>
            <IconThreeDotsCircle /><span>More Info</span>
          </button>
        </li>}
        {isDesktop && mounted && <li>
          <button onClick={() => window.print()}>
            <IconPrinter /><span>Print</span>
          </button>
        </li>}
      </ul>

      <div className={classes['article-section']}>
        <div className={classes['article-section__content']}>
          <PortableText components={myPortableTextComponents} value={content} />
        </div>
      </div>
    </div>
  )
}

export default StandardContent