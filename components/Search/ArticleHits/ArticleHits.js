import { useEffect, useRef } from 'react';
import { useInfiniteHits, useInstantSearch } from 'react-instantsearch-hooks-web'
import DynamicArticleCard from '@/components/Cards/DynamicArticleCard';
import classes from "./ArticleHits.module.scss";

const ArticleHits = (props) => {
  const { hits, isLastPage, showMore, results } = useInfiniteHits(props)
  const sentinelRef = useRef(null)
  const { scopedResults } = useInstantSearch(props)
  const { indexId } = props
  const foundScoped = scopedResults?.find(index => index.indexId === indexId)

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
      {foundScoped?.results?.nbHits > 0 && <div className={classes['hits']}>
          {hits.map((hit) => {
              return (
                  <div className={classes['grid-item']} key={hit.objectID}>
                      <DynamicArticleCard article={hit} responsiveImage={true} />
                  </div>
              )
          })}
          <div className="ais-InfiniteHits-sentinel" ref={sentinelRef} aria-hidden="true">
          </div>
      </div>}
      {foundScoped?.results?.nbHits == 0 && <div className={classes['no-results']}>
        <h4>Sorry, we could not find anything for <span>"{foundScoped?.results?.query}"</span></h4>
        <p className="secondary--body">Try a different search term</p>
      </div>}
    </div>
  )
}

export default ArticleHits