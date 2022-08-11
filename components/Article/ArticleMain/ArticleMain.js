import { useRef, createRef, forwardRef } from 'react'
import classes from './ArticleMain.module.scss'
import ArticleNav from '@/components/Article/ArticleNav'
import StandardContent from '../ArticleContent/StandardContent'
import RecipeContent from '../ArticleContent/RecipeContent'
import ArticleSidebar from '../ArticleSidebar'

const ArticleMain = forwardRef(({contentType, fields, products, showNav = false, showSidebar = false, blogGlobalSettings}, ref) => {

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
        return <RecipeContent ref={refs} fields={fields} products={products} />
      case 'standard':
        return <StandardContent ref={refs} fields={fields} products={products} />
      default:
        return ''
    }
  }

  return (
    <div ref={ref} className={classes['article-main']}>
      {showNav && refs.current && Object.keys(refs.current).length && <ArticleNav ref={refs} />}
      <div className={classes['article-main__wrapper']}>
        {getContent(contentType)}
        {(sidebar || showSidebar) && <ArticleSidebar fields={sidebar} blogGlobalSettings={blogGlobalSettings} />}
      </div>
    </div>
  )
})

export default ArticleMain