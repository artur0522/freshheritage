import { useEffect, useRef } from 'react'
import { useInfiniteHits } from 'react-instantsearch-hooks-web'
import SearchProductCard from '@/components/Cards/SearchProductCard'

import classes from "./ProductHits.module.scss"

const ProductHits = (props) => {
  const { hits, isLastPage, showMore } = useInfiniteHits(props)
  const sentinelRef = useRef(null)

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

  return (
    <div className={classes["collection__list"]}>
        {hits.map((product, index) => (
            <div className={classes.item} key={`${product.objectID}-${index}`}>
                <SearchProductCard product={product} />
            </div>
        ))}
    </div>
  )
}

export default ProductHits