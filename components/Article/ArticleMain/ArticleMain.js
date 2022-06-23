import classes from './ArticleMain.module.scss'
import ArticleContent from '../ArticleContent'
import ArticleSidebar from '../ArticleSidebar'

const ArticleMain = ({fields}) => {
  return (
    <div className={classes['article-main']}>
      <ArticleContent fields={fields} />
      <ArticleSidebar fields={fields} />
    </div>
  )
}

export default ArticleMain