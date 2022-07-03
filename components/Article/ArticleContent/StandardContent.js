import ResponsiveImage from '@/components/ResponsiveImage'
import { PortableText } from '@portabletext/react'
import classes from './ArticleContent.module.scss'
import ArticleProduct from '../ArticleProduct'
import ArticleSocialSharing from '../ArticleSocialSharing'

const StandardContent = ({fields, product}) => {

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
  return (
    <div className={`${classes['article-content']}`}>

      <ArticleSocialSharing />

      <div className={classes['article-section']}>
        <div className={classes['article-section__content']}>
          <PortableText components={myPortableTextComponents} value={content} />
        </div>
      </div>
    </div>
  )
}

export default StandardContent