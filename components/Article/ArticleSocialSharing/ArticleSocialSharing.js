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
import { useRouter } from 'next/router'
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ArticleSocialSharing = ({ seo }) => {

  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )
  const { setIsSidebarOpen } = useArticleContext()
  const router = useRouter()
  const url = `https://${process.env.NEXT_PUBLIC_MYSHOPIFY_DOMAIN}${router.asPath}`

  useEffect(() => {
    setMounted(true)
  }, [])

  const shareNetwork = (network, shareLink = window.location.href) => {
    switch (network) {
      case 'facebook':
        window.open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(shareLink)+"&title="+document.title, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=550,width=800')
        break
      case 'twitter':
        window.open("https://twitter.com/share?url="+ encodeURIComponent(shareLink)+"&text="+document.title, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=550,width=800')
        break
      case 'pinterest':
        var imgURL = seo?.shareGraphic?.asset?.url || '';
        var description = seo?.metaDesc || '';
        // if (window.location.pathname.indexOf('/blogs/') !== -1) {
        //   imgURL = encodeURIComponent($self.closest('.article-main').find('.article-image img').attr('src'));
        //   description = encodeURIComponent($self.closest('.article-main').find('.article-excerpt').text());
        // } else {
        //   imgURL = encodeURIComponent($('.js-product-image.swiper-slide-active img').attr('src'));
        //   description = encodeURIComponent($('.js-product-description').text());
        // }
        window.open('http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(shareLink) + '&media=' + imgURL + '&description=' + description, 'Pinterest', 'width=600, height=400, scrollbars=no');
        break;
      case 'email':
        window.location.href = `mailto:?subject=I'd like to share a link with you&body=${shareLink}`
        break
    }
  }

  return (
    <ul className={classes['article-social-sharing']}>
      {/* <li>
        <button>
          <IconBookmark /><span>Save</span>
        </button>
      </li> */}
      <li>
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsHovered(true)}
          className={`${classes['article-social-sharing-btn']} ${classes['share-btn']}`}>
          <IconShare />
          <span>Share</span>
          {isHovered && <ul className={classes['article-social-sharing-items']}>
            <li>
              <button onClick={() => shareNetwork('facebook', url)}>
                <IconShareFacebook />
              </button>
            </li>
            <li>
              <button onClick={() => shareNetwork('pinterest', url)}>
                <IconSharePinterest />
              </button>
            </li>
            <li>
              <button onClick={() => shareNetwork('email', url)}>
                <IconShareEmail />
              </button>
            </li>
            <li>
              <CopyToClipboard text={url}>
                <button className={classes['article-social-sharing-item__link']}>
                  <IconShareLink />
                </button>
              </CopyToClipboard>
            </li>
          </ul>}
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