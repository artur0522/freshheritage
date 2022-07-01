import { useRef } from 'react'
import classes from './ArticleMain.module.scss'
import ArticleNav from '@/components/Article/ArticleNav'
import ArticleContent from '../ArticleContent'
import ArticleSidebar from '../ArticleSidebar'

const ArticleMain = ({fields, product}) => {

  const ingredientsRef = useRef()
  const directionsRef = useRef()
  const proTipsRef = useRef()

  const refs = useRef({ingredientsRef, directionsRef, proTipsRef })

  const { content, sidebar } = fields

  return (
    <>
      <ArticleNav ref={refs} fields={fields.content} />
      <div className={classes['article-main']}>
        <ArticleContent ref={refs} fields={content} product={product} />
        <ArticleSidebar fields={sidebar} />
      </div>
    </>
  )
}

export default ArticleMain