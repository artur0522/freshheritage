import { useEffect, useRef } from 'react'
import { useInfiniteHits, useInstantSearch } from 'react-instantsearch-hooks-web'
import SearchProductCard from '@/components/Cards/SearchProductCard'
import { dataLayerViewSearchResults } from '@/utils/dataLayer'

import classes from "./ProductHits.module.scss"

const ProductHits = (props) => {
  const { hits, isLastPage, showMore } = useInfiniteHits(props)
  const sentinelRef = useRef(null)
  const { scopedResults } = useInstantSearch(props)
  const { indexId, currentIndex } = props
  const foundScoped = scopedResults?.find(index => index.indexId === indexId)

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore();
          }
        });
      });

      observer.observe(sentinelRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [isLastPage, showMore]);

  useEffect(() => {
    dataLayerViewSearchResults({products: hits})
  }, [hits])

  return (
    <div className={classes['hits-wrap']}>
      {foundScoped?.results?.nbHits > 0 && <div className={classes['hits']}>
          {hits.map((hit) => {
              return (
                  <div className={classes['grid-item']} key={hit.objectID}>
                      <SearchProductCard product={hit} />
                  </div>
              )
          })}
          <div className="ais-InfiniteHits-sentinel" ref={sentinelRef} aria-hidden="true">
          </div>
      </div>}
      {foundScoped?.results?.nbHits == 0 && currentIndex !== 'all_results'  && <div className={classes['no-results']}>
        <h4>Sorry, we could not find anything for <span>&#34;{foundScoped?.results?.query}&#34;</span></h4>
        <p className="secondary--body">Try a different search term</p>
      </div>}
    </div>
  )
}

export default ProductHits