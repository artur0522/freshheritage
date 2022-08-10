import { useState, useEffect } from 'react'
import classes from './ArticleSidebar.module.scss'
import articleContentClasses from '../ArticleContent/ArticleContent.module.scss'
import ResponsiveImage from '@/components/ResponsiveImage'
import { PortableText } from '@portabletext/react'
import EmailSignup from '@/components/EmailSignup'
import Image from 'next/image'
import Link from 'next/link'
import { useArticleContext } from '@/context/ArticleContext'
import { useKnowYourFishDrawerContext } from '@/context/KnowYourFishDrawerContext'
import IconCaret from '@/svgs/caret.svg'
import { nacelleClient } from 'services'

const ArticleSidebar = ({fields = {}, blogGlobalSettings}) => {

  const { content, author, hosts, relatedArticles, knowYourFishList, classSignup } = fields
  const { isSidebarOpen, setIsSidebarOpen } = useArticleContext()
  const { openDrawer } = useKnowYourFishDrawerContext()
  const [articles, setArticles] = useState([])

  useEffect(() => {
    const getArticles = async () => {
      const articles = await nacelleClient.content({
        handles: relatedArticles.relatedArticleItems
      })
      return articles
    }


    if (relatedArticles?.relatedArticleItems?.length > 0) {
      getArticles()
        .then(res => {
          setArticles(res)
        })
    }


  }, [])

  return (
    <div className={`article-sidebar ${classes['article-sidebar']} ${isSidebarOpen ? classes['is-open'] : ''}`}>

      <div className={classes['article-sidebar__header']}>
        <button onClick={() => setIsSidebarOpen()}><IconCaret /><span>Back</span></button>
        <h5>About the Article</h5>
      </div>

      <div className={classes['article-sidebar__main']}>

        {content && <div className={`${articleContentClasses['article-section__content']} ${classes['article-sidebar__section']}`}>
          <PortableText value={content} />
        </div>}

        {classSignup && <div className={`${classes['article-class-signup']} ${classes['article-sidebar__section']}`}>
          <EmailSignup props={{
            title: classSignup.header,
            ctaText: 'Sign Me Up',
            listId: classSignup.klaviyoListId,
            customCheckbox: {
              label: classSignup.checkboxLabel,
              disclaimer: classSignup.disclaimer,
              checkboxKlaviyoProperty: classSignup.checkboxKlaviyoProperty
            }
          }} />
        </div>}

        {author && <div className={`${classes['article-author']} ${classes['article-sidebar__section']}`}>
          <div className={classes['article-author__header']}>
            <div className={classes['article-author__image']}>
              <ResponsiveImage
                src={author.image.asset.url}
                alt={author.image.alt || ''}
              />
            </div>
            <h2>{author.name}</h2>
          </div>
          <div className={classes['article-author__description']}>
            <PortableText value={author.description} />
          </div>
        </div>}

        {hosts && <div className={`${classes['article-author']} ${classes['article-sidebar__section']}`}>
          <div className={`${articleContentClasses['article-section__content']}`}>
            <PortableText value={hosts.description} />
          </div>
          <ul className={classes['article-host-list']}>
            {hosts.hostList.map(author => {
              return <li key={author._id}>
                <div className={classes['article-author__image']}>
                  <ResponsiveImage
                    src={author.image.asset.url}
                    alt={author.image.alt || ''}
                  />
                </div>
                <h2>{author.name}</h2>
              </li>
            })}
          </ul>
        </div>}

        {blogGlobalSettings?.klaviyoListId && !classSignup && <div className={`${classes['article-email-signup']} ${classes['article-sidebar__section']}`}>
          <EmailSignup props={{
            title: 'Get Recipes & Stories Delivered To Your Inbox',
            ctaText: 'Join The List',
            listId: blogGlobalSettings.klaviyoListId
          }} />
        </div>}

        {knowYourFishList &&
          <div className={`${classes['article-related-items']} ${classes['article-sidebar__section']}`}>
            <h2>{knowYourFishList.header}</h2>
            <ul className={classes['article-related-item-list']}>
              {knowYourFishList.knowYourFishes.map((item, index) => {
                const { header, peakSeason, nutritionalInfo, image } = item
                return <li key={index} className={classes['know-your-fish__item']} onClick={() => openDrawer({ fields: item })}>
                  <div className={classes['article-related-item__image']}>
                    <Image
                      src={image.asset.url}
                      layout="fill"
                      alt={image.alt || ''}
                    />
                  </div>
                  {header && <h2 className={classes['know-your-fish__title']}>{header}</h2>}
                  {peakSeason && <div className={classes['know-your-fish__detail-item']}>
                    <h3>Peak Season:</h3>
                    <p>{peakSeason}</p>
                  </div>}
                  {nutritionalInfo && <div className={classes['know-your-fish__detail-item']}>
                    <h3>Nutritional info:</h3>
                    <p>{nutritionalInfo}</p>
                  </div>}
                </li>
              })}
            </ul>
          </div>
        }

        {articles.length > 0 &&
          <div className={`${classes['article-related-items']} ${classes['article-sidebar__section']}`}>
            <h2>{relatedArticles.header}</h2>
            <ul className={classes['article-related-item-list']}>
              {articles.map((item, index) => {

                const image = item.fields.hero?.desktopBackgroundImage
                const handle = item.handle?.current ? item.handle.current : item.handle;
                const blog = item.fields ? item.fields.blog : item.blog

                if (!image) {
                  return ''
                }

                let url = `/${handle}`

                if (item.blog) {
                  const blogType = blog.blogType
                  const blogCategory = blog.handle?.current ? blog.handle.current : blog.handle
                  url = `/blogs/${blogType}/${blogCategory}/${handle}`
                }

                return <li key={index}>
                  <Link href={url}>
                    <a>
                      <div className={classes['article-related-item__image']}>
                        <Image
                          src={image.asset.url}
                          layout="fill"
                          alt={image.alt || ''}
                        />
                      </div>
                    </a>
                  </Link>
                  <Link href={url}>
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