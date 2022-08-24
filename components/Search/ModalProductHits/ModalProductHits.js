import { useInfiniteHits, useInstantSearch } from 'react-instantsearch-hooks-web'
import ModalProductCard from '@/components/Cards/ModalProductCard'
import Link from 'next/link';
import classes from "./ModalProductHits.module.scss"

const ModalProductHits = (props) => {
  const { hits, results } = useInfiniteHits(props)
  const { scopedResults } = useInstantSearch(props)
  const { indexId } = props
  const foundScoped = scopedResults?.find(index => index.indexId === indexId)

  return (
    <div className={classes['hits-wrap']}>
      {results.query !== '' && <div className={classes['hits']}>
        <div className={classes['hits-header']}>
          <h6>{foundScoped?.results?.nbHits} product results for <span>"{results.query}"</span></h6>
          <Link href={`/pages/search/?query=${results.query}`}>
            <a className="secondary--body">View All</a>
          </Link>
        </div>
       

        <div className={classes['hits-items']}>
          {hits.slice(0,2).map((hit) => {
              return (
                  <div className={classes['grid-item']} key={hit.objectID}>
                    <ModalProductCard product={hit} />
                  </div>
              )
            })}
        </div>
      </div>}
    </div>
  )
}

export default ModalProductHits