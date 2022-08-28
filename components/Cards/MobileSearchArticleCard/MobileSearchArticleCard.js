import classes from "./MobileSearchArticleCard.module.scss"
import Link from "next/link"

import ArrowIcon from '@/svgs/article-card-arrow.svg'

const MobileSearchArticleCard = ({article}) => {
  return (
    <div className={classes['card']}>
       <p className="secondary--body">{article.blog.title}</p>
       <h4>{article.title}</h4>
       <Link href={`/blogs/${article.blog.blogType}/${article.blog.handle.current}/${article.handle.current}`}>
            <a>
                Read Article
                <ArrowIcon />
            </a>
       </Link>
    </div>
  )
}

export default MobileSearchArticleCard