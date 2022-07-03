import classes from './ArticleSidebar.module.scss'
import ResponsiveImage from '@/components/ResponsiveImage'
import { PortableText } from '@portabletext/react'
import EmailSignup from '@/components/EmailSignup'
import Image from 'next/image'
import Link from 'next/link'
import { useArticleContext } from '@/context/ArticleContext'
import IconCaret from '@/svgs/caret.svg'

const ArticleSidebar = ({fields}) => {

  const { author, relatedArticles } = fields
  const { isSidebarOpen, setIsSidebarOpen } = useArticleContext()

  return (
    <div className={`${classes['article-sidebar']} ${isSidebarOpen ? classes['is-open'] : ''}`}>

      <div className={classes['article-sidebar__header']}>
        <button onClick={() => setIsSidebarOpen()}><IconCaret /><span>Back</span></button>
        <h5>About the Article</h5>
      </div>

      <div className={classes['article-sidebar__main']}>

        <div className={`${classes['article-author']} ${classes['article-sidebar__section']}`}>
          <div className={classes['article-author__header']}>
            <div className={classes['article-author__image']}>
              <ResponsiveImage
                src={author.image.asset.url}
                alt={author.image.asset.alt || ''}
              />
            </div>
            <h2>{author.name}</h2>
          </div>
          <div className={classes['article-author__description']}>
            <PortableText value={author.description} />
          </div>
        </div>

        <div className={`${classes['article-email-signup']} ${classes['article-sidebar__section']}`}>
          <EmailSignup props={{
            title: 'Get Recipes & Stories Delivered To Your Inbox',
            ctaText: 'Join The List'
          }} />
        </div>

        {relatedArticles &&
          <div className={`${classes['article-related-items']} ${classes['article-sidebar__section']}`}>
            <h2>{relatedArticles.header}</h2>
            <ul className={classes['article-related-item-list']}>
              {relatedArticles.relatedArticleItems.map(item => {

                const image = item.coverImage || item.hero.desktopBackgroundImage

                return <li key={item._id}>
                  <Link href={item.handle.current}>
                    <a>
                      <div className={classes['article-related-item__image']}>
                        <Image
                          src={image.asset.url}
                          layout="fill"
                          alt={image.asset.alt || ''}
                        />
                      </div>
                    </a>
                  </Link>
                  <Link href={item.handle}>
                    <a>
                      <h4 className="heading--article">{item.title}</h4>
                    </a>
                  </Link>
                </li>
              })}
            </ul>
          </div>
        }

      </div>
    </div>
  )
}

export default ArticleSidebar