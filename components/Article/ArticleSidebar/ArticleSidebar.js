import classes from './ArticleSidebar.module.scss'
import ResponsiveImage from '@/components/ResponsiveImage'
import { PortableText } from '@portabletext/react'
import EmailSignup from '@/components/EmailSignup'
import Link from 'next/link'

const ArticleSidebar = ({fields}) => {

  const { author, relatedCookingGuide } = fields

  return (
    <div className={classes['article-sidebar']}>
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

        {relatedCookingGuide &&
          <div className={`${classes['article-related-cooking-guides']} ${classes['article-sidebar__section']}`}>
            <h2>Related Cooking Guide</h2>
            <ul className={classes['cooking-guides']}>
              {relatedCookingGuide.map(item => {
                return <li key={item._id}>
                  <Link href={item.handle.current}>
                    <a>
                      <div className={classes['cooking-guide-item__image']}>
                        <ResponsiveImage
                          src={item.coverImage.asset.url}
                          alt={item.coverImage.asset.alt || ''}
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