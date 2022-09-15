import { useEffect, useRef, useState } from 'react';
import { useInfiniteHits, useInstantSearch } from 'react-instantsearch-hooks-web'
import ArticleCard from '@/components/Cards/ArticleCard'
import MobileSearchArticleCard from '@/components/Cards/MobileSearchArticleCard';
import { useMediaQuery } from 'react-responsive'

import classes from "./ArticleHits.module.scss"

const ArticleHits = (props) => {
  const { hits, isLastPage, showMore } = useInfiniteHits(props)
  const sentinelRef = useRef(null)
  const { scopedResults } = useInstantSearch(props)
  const { indexId, currentIndex } = props
  const foundScoped = scopedResults?.find(index => index.indexId === indexId)
  const [mounted, setMounted] = useState(false)


  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 768px)'}
  )

  useEffect(() => {
    setMounted(true)

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
      {foundScoped?.results?.nbHits > 0 && mounted && isDesktop && <div className={classes['hits']}>
          {hits.map((hit) => {
              return (
                  <div className={classes['grid-item']} key={hit.objectID}>
                    <ArticleCard article={hit} responsiveImage={false} fromSearch={true} />
                  </div>
              )
          })}
          <div className="ais-InfiniteHits-sentinel" ref={sentinelRef} aria-hidden="true">
          </div>
      </div>}
      {foundScoped?.results?.nbHits > 0 && mounted && isMobile && <div className={classes['hits']}>
          {hits.map((hit) => {
              return (
                  <div className={classes['grid-item']} key={hit.objectID}>
                    <MobileSearchArticleCard article={hit} />
                  </div>
              )
          })}
          <div className="ais-InfiniteHits-sentinel" ref={sentinelRef} aria-hidden="true">
          </div>
      </div>}
      {foundScoped?.results?.nbHits == 0 && currentIndex !== 'all_results' && <div className={classes['no-results']}>
        <h4>Sorry, we could not find anything for <span>&#34;{decodeURI(foundScoped?.results?.query)}&#34;</span></h4>
        <p className="secondary--body">Try a different search term</p>
      </div>}
    </div>
  )
}

export default ArticleHits