import { useEffect, useRef } from 'react';
import { useInfiniteHits } from 'react-instantsearch-hooks-web'
import DynamicArticleCard from '@/components/Cards/DynamicArticleCard';
import classes from "./ArticleHits.module.scss";

const ArticleHits = (props) => {
  const { hits, isLastPage, showMore, results } = useInfiniteHits(props)
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore()
          }
        })
      })

      observer.observe(sentinelRef.current)

      return () => {
        observer.disconnect()
      };
    }
  }, [isLastPage, showMore])

  return (
    <div className={classes['hits-wrap']}>
        <div className={classes['hits']}>
            {hits.map((hit) => {
                return (
                    <div className={classes['grid-item']} key={hit.objectID}>
                        <DynamicArticleCard article={hit} />
                    </div>
                )
            })}
            <div className="ais-InfiniteHits-sentinel" ref={sentinelRef} aria-hidden="true">
            </div>
        </div>
    </div>
  )
}

export default ArticleHits