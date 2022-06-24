import classes from './ArticleSidebar.module.scss'
import ResponsiveImage from '@/components/ResponsiveImage'
import { PortableText } from '@portabletext/react'

const ArticleSidebar = ({fields}) => {

  const { author } = fields

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
      </div>
    </div>
  )
}

export default ArticleSidebar