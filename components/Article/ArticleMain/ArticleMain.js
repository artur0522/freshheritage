import { useRef } from 'react'
import classes from './ArticleMain.module.scss'
import ArticleNav from '@/components/Article/ArticleNav'
import StandardContent from '../ArticleContent/StandardContent'
import RecipeContent from '../ArticleContent/RecipeContent'
import ArticleSidebar from '../ArticleSidebar'

const ArticleMain = ({contentType, fields, product, showNav = false}) => {

  const ingredientsRef = useRef()
  const directionsRef = useRef()
  const proTipsRef = useRef()

  const refs = useRef({ingredientsRef, directionsRef, proTipsRef })

  const { content, sidebar } = fields

  const getContent = (type) => {
    switch(type) {
      case 'recipe':
        return <RecipeContent ref={refs} fields={content} product={product} />
      case 'standard':
        return <StandardContent fields={fields} product={product} />
      default:
        return ''
    }
  }

  return (
    <div className={classes['article-main']}>
      {showNav && <ArticleNav ref={refs} fields={fields.content} />}
      <div className={classes['article-main__wrapper']}>
        {getContent(contentType)}
        <ArticleSidebar fields={sidebar} />
      </div>
    </div>
  )
}

export default ArticleMain