import React, { useState, useEffect } from 'react'
import classes from './ArticleSocialSharing.module.scss'
import { useMediaQuery } from 'react-responsive'
import IconThreeDotsCircle from '@/svgs/three-dots-circle.svg'
import IconPrinter from '@/svgs/printer.svg'
import IconBookmark from '@/svgs/bookmark.svg'
import IconShare from '@/svgs/share.svg'
import IconShareFacebook from '@/svgs/share-facebook.svg'
import IconSharePinterest from '@/svgs/share-pinterest.svg'
import IconShareEmail from '@/svgs/share-email.svg'
import IconShareLink from '@/svgs/share-link.svg'
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
        <div className={classes['article-social-sharing-btn']}>
          <IconShare />
          <span>Share</span>
          <ul className="">
            <li>
              <button>
                <IconShareFacebook />
              </button>
            </li>
            <li>
              <button>
                <IconSharePinterest />
              </button>
            </li>
            <li>
              <button>
                <IconShareEmail />
              </button>
            </li>
            <li>
              <button>
                <IconShareLink />
              </button>
            </li>
          </ul>
        </div>
      </li>
      {isMobile && mounted && <li>
        <button onClick={() => setIsSidebarOpen(true)}
          className={`${classes['article-social-sharing-btn']} ${classes['more-info-btn']}`}>
          <IconThreeDotsCircle /><span>More Info</span>
        </button>
      </li>}
      {isDesktop && mounted && <li>
        <button  className={classes['article-social-sharing-btn']} onClick={() => window.print()}>
          <IconPrinter /><span>Print</span>
        </button>
      </li>}
    </ul>
  )
}

export default ArticleSocialSharing