import { useRef, createRef } from 'react'
import classes from './ArticleMain.module.scss'
import ArticleNav from '@/components/Article/ArticleNav'
import StandardContent from '../ArticleContent/StandardContent'
import RecipeContent from '../ArticleContent/RecipeContent'
import ArticleSidebar from '../ArticleSidebar'

const ArticleMain = ({contentType, fields, product, showNav = false}) => {

  const h1blocks = fields.content?.filter(item => item.style === 'h1')

  const refs = useRef(h1blocks?.reduce((carry, block) => {
    return {
      ...carry,
      [block.children[0].text]: createRef()
    }
  }, {}))

  const { sidebar } = fields

  const getContent = (type) => {
    switch(type) {
      case 'recipe':
        return <RecipeContent ref={refs} fields={fields} product={product} />
      case 'standard':
        return <StandardContent ref={refs} fields={fields} product={product} />
      default:
        return ''
    }
  }

  return (
    <div className={classes['article-main']}>
      {showNav && <ArticleNav ref={refs} />}
      <div className={classes['article-main__wrapper']}>
        {getContent(contentType)}
        {sidebar && <ArticleSidebar fields={sidebar} />}
      </div>
    </div>
  )
}

export default ArticleMain