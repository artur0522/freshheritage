import React, { useState, useEffect } from 'react'
import classes from './ArticleSocialSharing.module.scss'
import { useMediaQuery } from 'react-responsive'
import IconThreeDotsCircle from '@/svgs/three-dots-circle.svg'
import IconPrinter from '@/svgs/printer.svg'
import IconBookmark from '@/svgs/bookmark.svg'
import IconShare from '@/svgs/share.svg'
import { useArticleContext } from '@/context/ArticleContext'

const ArticleSocialSharing = () => {

  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )
  const { setIsSidebarOpen } = useArticleContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
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
        <button onClick={() => setIsSidebarOpen(true)}
          className={classes['more-info-btn']}>
          <IconThreeDotsCircle /><span>More Info</span>
        </button>
      </li>}
      {isDesktop && mounted && <li>
        <button onClick={() => window.print()}>
          <IconPrinter /><span>Print</span>
        </button>
      </li>}
    </ul>
  )
}

export default ArticleSocialSharing